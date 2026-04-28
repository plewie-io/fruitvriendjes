import jsPDF from "jspdf";
import RobotoRegularUrl from "@/assets/fonts/Roboto-Regular.ttf?url";
import RobotoBoldUrl from "@/assets/fonts/Roboto-Bold.ttf?url";

const ORANGE: [number, number, number] = [240, 132, 0]; // #F08400
const DARK: [number, number, number] = [0, 0, 0];
const MUTED: [number, number, number] = [110, 110, 110];

const BODY_SIZE = 12;
const FONT = "Roboto";

// Cache fonts so we only fetch once per session
let fontsLoaded: Promise<{ regular: string; bold: string }> | null = null;

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(
      null,
      Array.from(bytes.subarray(i, i + chunk))
    );
  }
  return btoa(binary);
};

const loadFonts = async () => {
  if (!fontsLoaded) {
    fontsLoaded = (async () => {
      const [r, b] = await Promise.all([
        fetch(RobotoRegularUrl).then((res) => res.arrayBuffer()),
        fetch(RobotoBoldUrl).then((res) => res.arrayBuffer()),
      ]);
      return {
        regular: arrayBufferToBase64(r),
        bold: arrayBufferToBase64(b),
      };
    })();
  }
  return fontsLoaded;
};

const registerFonts = async (pdf: jsPDF) => {
  try {
    const { regular, bold } = await loadFonts();
    pdf.addFileToVFS("Roboto-Regular.ttf", regular);
    pdf.addFont("Roboto-Regular.ttf", FONT, "normal");
    pdf.addFileToVFS("Roboto-Bold.ttf", bold);
    pdf.addFont("Roboto-Bold.ttf", FONT, "bold");
    return true;
  } catch (e) {
    console.warn("Recipe PDF: kon Roboto niet laden, val terug op helvetica", e);
    return false;
  }
};

// Verwijder emoji's, niet-printbare en exotische tekens die jsPDF niet
// correct kan renderen (Ø=Þ, Ø<ßL, etc. zijn emoji-codepoints in WinAnsi).
const cleanText = (s: string): string => {
  return s
    // Emoji & symbol blocks
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
    .replace(/[\u{2600}-\u{27BF}]/gu, "")
    .replace(/[\u{1F000}-\u{1F2FF}]/gu, "")
    .replace(/[\u{FE00}-\u{FE0F}]/gu, "") // variation selectors
    .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, "") // flags
    .replace(/\uFFFD/g, "")
    // Smart quotes / dashes -> ascii equivalents
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...")
    // Collapse whitespace
    .replace(/[ \t]+/g, " ")
    .trim();
};

const stripInline = (s: string) =>
  cleanText(
    s
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/__(.+?)__/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/_(.+?)_/g, "$1")
      .replace(/`(.+?)`/g, "$1")
      .replace(/[#>]+\s*/g, "")
  );

const isGenericTitle = (t: string) => {
  const lower = t.toLowerCase();
  return (
    lower === "jouw recept" ||
    lower === "jouw recept:" ||
    lower === "recept" ||
    lower === "recept:"
  );
};

// Regels die nooit in de PDF horen (afsluitende AI-vraag e.d.)
const SKIP_PATTERNS: RegExp[] = [
  /wil je dit gerecht veganistisch/i,
  /ik kan het recept voor je aanpassen/i,
  /wil je dat ik het recept aanpas/i,
];

const shouldSkipLine = (text: string): boolean =>
  SKIP_PATTERNS.some((re) => re.test(text));

export const extractRecipeTitle = (markdown: string): string => {
  const lines = markdown.split("\n");
  for (const raw of lines) {
    const m = raw.match(/^\s*#{1,3}\s+(.+?)\s*#*\s*$/);
    if (m) {
      const cleaned = stripInline(m[1]);
      if (cleaned && !isGenericTitle(cleaned)) return cleaned;
    }
  }
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
  const hasRoboto = await registerFonts(pdf);
  const fontFamily = hasRoboto ? FONT : "helvetica";

  const setFont = (weight: "normal" | "bold") =>
    pdf.setFont(fontFamily, weight);

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
  setFont("bold");
  pdf.setFontSize(20);
  pdf.setTextColor(...ORANGE);
  const titleWrapped = pdf.splitTextToSize(recipeTitle, contentWidth);
  pdf.text(titleWrapped, marginX, y);
  y += titleWrapped.length * 8 + 2;

  pdf.setDrawColor(...ORANGE);
  pdf.setLineWidth(0.4);
  pdf.line(marginX, y, pageWidth - marginX, y);
  y += 6;

  // Optional recipe photo
  if (recipeImage) {
    const img = await compressImage(recipeImage, 700, 0.55);
    if (img) {
      const ratio = img.h / img.w;
      let drawW = Math.min(contentWidth, 110);
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

  const lineHeightBody = BODY_SIZE * 0.5; // ~6mm

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
      if (!text || isGenericTitle(text) || shouldSkipLine(text)) continue;
      const key = `h:${text.toLowerCase()}`;
      if (seen.has(key) || key === titleKey) continue;
      seen.add(key);
      lastKey = key;
      const level = Math.min(hMatch[1].length, 3);
      const size = level === 1 ? 15 : level === 2 ? 13 : 12;
      y += 2;
      setFont("bold");
      pdf.setFontSize(size);
      pdf.setTextColor(...ORANGE);
      writeWrapped(text, marginX, contentWidth, size * 0.5);
      continue;
    }

    // Bullets
    const bMatch = line.match(/^\s*[-*+]\s+(.*)$/);
    if (bMatch) {
      const text = stripInline(bMatch[1]);
      if (!text || shouldSkipLine(text)) continue;
      const key = `b:${text.toLowerCase()}`;
      if (seen.has(key) || key === lastKey) continue;
      seen.add(key);
      lastKey = key;
      setFont("normal");
      pdf.setFontSize(BODY_SIZE);
      const wrapped = pdf.splitTextToSize(text, contentWidth - 6);
      ensureSpace(wrapped.length * lineHeightBody + 1);
      pdf.setTextColor(...ORANGE);
      pdf.text("•", marginX, y);
      pdf.setTextColor(...DARK);
      pdf.text(wrapped, marginX + 5, y);
      y += wrapped.length * lineHeightBody + 1;
      continue;
    }

    // Numbered
    const nMatch = line.match(/^\s*(\d+)[.)]\s+(.*)$/);
    if (nMatch) {
      const text = stripInline(nMatch[2]);
      if (!text || shouldSkipLine(text)) continue;
      const key = `n:${text.toLowerCase()}`;
      if (seen.has(key) || key === lastKey) continue;
      seen.add(key);
      lastKey = key;
      setFont("normal");
      pdf.setFontSize(BODY_SIZE);
      const wrapped = pdf.splitTextToSize(text, contentWidth - 8);
      ensureSpace(wrapped.length * lineHeightBody + 1);
      setFont("bold");
      pdf.setTextColor(...ORANGE);
      pdf.text(`${nMatch[1]}.`, marginX, y);
      setFont("normal");
      pdf.setTextColor(...DARK);
      pdf.text(wrapped, marginX + 7, y);
      y += wrapped.length * lineHeightBody + 1;
      continue;
    }

    // Paragraph
    const text = stripInline(line);
    if (!text || isGenericTitle(text) || shouldSkipLine(text)) continue;
    const key = `p:${text.toLowerCase()}`;
    if (seen.has(key) || key === lastKey) continue;
    seen.add(key);
    lastKey = key;
    setFont("normal");
    pdf.setFontSize(BODY_SIZE);
    pdf.setTextColor(...DARK);
    writeWrapped(text, marginX, contentWidth, lineHeightBody);
  }

  // Footer
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    setFont("normal");
    pdf.setFontSize(9);
    pdf.setTextColor(...MUTED);
    pdf.text("Fruitvriendjes • Mandy Mandarijn", marginX, pageHeight - 8);
    pdf.text(`${i} / ${pageCount}`, pageWidth - marginX, pageHeight - 8, {
      align: "right",
    });
  }

  pdf.save(`${sanitizeFilename(recipeTitle)}.pdf`);
};
