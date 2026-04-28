import jsPDF from "jspdf";

const ORANGE: [number, number, number] = [240, 132, 0]; // #F08400
const DARK: [number, number, number] = [0, 0, 0];
const MUTED: [number, number, number] = [110, 110, 110];

const stripInline = (s: string) =>
  s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/[#>]+\s*/g, "")
    .trim();

const isGenericTitle = (t: string) => {
  const lower = t.toLowerCase();
  return (
    lower === "jouw recept" ||
    lower === "jouw recept:" ||
    lower === "recept" ||
    lower === "recept:"
  );
};

export const extractRecipeTitle = (markdown: string): string => {
  const lines = markdown.split("\n");
  for (const raw of lines) {
    const m = raw.match(/^\s*#{1,3}\s+(.+?)\s*#*\s*$/);
    if (m) {
      const cleaned = stripInline(m[1]);
      if (cleaned && !isGenericTitle(cleaned)) return cleaned;
    }
  }
  // Fallback: first non-empty plain line
  for (const raw of lines) {
    const cleaned = stripInline(raw);
    if (cleaned && !isGenericTitle(cleaned)) return cleaned;
  }
  return "Recept";
};

const sanitizeFilename = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60) || "recept";

const compressImage = async (
  src: string,
  maxDim = 700,
  quality = 0.55
): Promise<{ data: string; w: number; h: number } | null> => {
  try {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no ctx"));
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        try {
          resolve({ data: canvas.toDataURL("image/jpeg", quality), w, h });
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = () => reject(new Error("image load failed"));
      img.src = src;
    });
  } catch (e) {
    console.warn("Recipe PDF: skipping image", e);
    return null;
  }
};

export const downloadRecipePdf = async (
  recipe: string,
  recipeImage: string | null
): Promise<void> => {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const marginX = 18;
  const marginTop = 22;
  const marginBottom = 18;
  const contentWidth = pageWidth - marginX * 2;
  let y = marginTop;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - marginBottom) {
      pdf.addPage();
      y = marginTop;
    }
  };

  // Top brand bar
  pdf.setFillColor(...ORANGE);
  pdf.rect(0, 0, pageWidth, 10, "F");

  // Title
  const recipeTitle = extractRecipeTitle(recipe);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.setTextColor(...ORANGE);
  const titleWrapped = pdf.splitTextToSize(recipeTitle, contentWidth);
  pdf.text(titleWrapped, marginX, y);
  y += titleWrapped.length * 8 + 2;

  pdf.setDrawColor(...ORANGE);
  pdf.setLineWidth(0.4);
  pdf.line(marginX, y, pageWidth - marginX, y);
  y += 6;

  // Optional recipe photo (compressed)
  if (recipeImage) {
    const img = await compressImage(recipeImage, 700, 0.55);
    if (img) {
      const ratio = img.h / img.w;
      let drawW = Math.min(contentWidth, 110); // cap width
      let drawH = drawW * ratio;
      const maxH = 70;
      if (drawH > maxH) {
        drawH = maxH;
        drawW = drawH / ratio;
      }
      ensureSpace(drawH + 6);
      const x = (pageWidth - drawW) / 2;
      pdf.addImage(img.data, "JPEG", x, y, drawW, drawH, undefined, "FAST");
      y += drawH + 6;
    }
  }

  // Body parsing
  const titleKey = `t:${recipeTitle.toLowerCase()}`;
  const seen = new Set<string>([titleKey]);
  let lastKey = "";

  const writeWrapped = (
    text: string,
    x: number,
    width: number,
    lineHeight: number
  ) => {
    const wrapped = pdf.splitTextToSize(text, width);
    ensureSpace(wrapped.length * lineHeight + 1);
    pdf.text(wrapped, x, y);
    y += wrapped.length * lineHeight + 1;
  };

  const lines = recipe.split("\n");
  for (const raw of lines) {
    const line = raw.replace(/\r/g, "");
    if (!line.trim()) {
      y += 2;
      lastKey = "";
      continue;
    }

    // Headings
    const hMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (hMatch) {
      const text = stripInline(hMatch[2]);
      if (!text || isGenericTitle(text)) continue;
      const key = `h:${text.toLowerCase()}`;
      if (seen.has(key) || key === titleKey) continue;
      seen.add(key);
      lastKey = key;
      const level = Math.min(hMatch[1].length, 3);
      const size = level === 1 ? 15 : level === 2 ? 13 : 11;
      y += 2;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(size);
      pdf.setTextColor(...ORANGE);
      writeWrapped(text, marginX, contentWidth, size * 0.5);
      continue;
    }

    // Bullets
    const bMatch = line.match(/^\s*[-*+]\s+(.*)$/);
    if (bMatch) {
      const text = stripInline(bMatch[1]);
      if (!text) continue;
      const key = `b:${text.toLowerCase()}`;
      if (seen.has(key) || key === lastKey) continue;
      seen.add(key);
      lastKey = key;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      const wrapped = pdf.splitTextToSize(text, contentWidth - 6);
      ensureSpace(wrapped.length * 5 + 1);
      pdf.setTextColor(...ORANGE);
      pdf.text("•", marginX, y);
      pdf.setTextColor(...DARK);
      pdf.text(wrapped, marginX + 5, y);
      y += wrapped.length * 5 + 1;
      continue;
    }

    // Numbered
    const nMatch = line.match(/^\s*(\d+)[.)]\s+(.*)$/);
    if (nMatch) {
      const text = stripInline(nMatch[2]);
      if (!text) continue;
      const key = `n:${text.toLowerCase()}`;
      if (seen.has(key) || key === lastKey) continue;
      seen.add(key);
      lastKey = key;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      const wrapped = pdf.splitTextToSize(text, contentWidth - 8);
      ensureSpace(wrapped.length * 5 + 1);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...ORANGE);
      pdf.text(`${nMatch[1]}.`, marginX, y);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(...DARK);
      pdf.text(wrapped, marginX + 7, y);
      y += wrapped.length * 5 + 1;
      continue;
    }

    // Paragraph
    const text = stripInline(line);
    if (!text || isGenericTitle(text)) continue;
    const key = `p:${text.toLowerCase()}`;
    if (seen.has(key) || key === lastKey) continue;
    seen.add(key);
    lastKey = key;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.setTextColor(...DARK);
    writeWrapped(text, marginX, contentWidth, 5);
  }

  // Footer per page
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(9);
    pdf.setTextColor(...MUTED);
    pdf.text(
      "Fruitvriendjes • Mandy Mandarijn",
      marginX,
      pageHeight - 8
    );
    pdf.text(
      `${i} / ${pageCount}`,
      pageWidth - marginX,
      pageHeight - 8,
      { align: "right" }
    );
  }

  pdf.save(`${sanitizeFilename(recipeTitle)}.pdf`);
};
