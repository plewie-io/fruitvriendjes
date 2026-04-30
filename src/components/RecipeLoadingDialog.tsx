import { useEffect, useMemo, useState } from "react";
import { BlenderLoader } from "./BlenderLoader";

interface RecipeLoadingDialogProps {
  open: boolean;
  phase: "recipe" | "image";
  /** Optional: ingredient list or recipe text — used to pick relevant cooking steps. */
  context?: string | null;
}

/** Generic cooking steps, always safe to show. */
const GENERIC_STEPS = [
  "De boodschappen klaarzetten...",
  "Alles netjes afwegen...",
  "De keuken opruimen tussendoor...",
  "Een schoon snijplankje pakken...",
  "Even proeven of het lekker is...",
  "De tafel dekken...",
  "Serveren met een glimlach!",
];

/** Conditional steps — only shown when matching keywords are found in the context. */
const CONDITIONAL_STEPS: { keywords: string[]; step: string }[] = [
  { keywords: ["oven", "bak", "ovenschaal", "gratin", "pizza", "quiche", "taart"], step: "De oven voorverwarmen..." },
  {
    keywords: [
      "groente", "wortel", "ui", "prei", "paprika", "courgette", "broccoli",
      "bloemkool", "tomaat", "komkommer", "sla", "spinazie", "champignon",
      "aubergine", "boon", "erwt", "mais", "selderij", "radijs", "biet",
    ],
    step: "De groenten wassen en snijden...",
  },
  {
    keywords: ["fruit", "appel", "peer", "banaan", "aardbei", "framboos", "blauwe bes", "druif", "mango", "ananas", "perzik", "kiwi", "meloen", "sinaasappel", "mandarijn", "citroen"],
    step: "Het fruit wassen en in stukjes snijden...",
  },
  { keywords: ["kip", "kipfilet", "kippendij"], step: "De kip mooi bruin bakken..." },
  { keywords: ["rundvlees", "gehakt", "biefstuk", "rund"], step: "Het vlees aanbakken in de pan..." },
  { keywords: ["varken", "spek", "ham"], step: "Het vlees rustig laten garen..." },
  { keywords: ["vis", "zalm", "tonijn", "kabeljauw", "garnaal", "schol"], step: "De vis voorzichtig bakken..." },
  { keywords: ["ei", "eieren", "omelet"], step: "De eieren losslaan..." },
  { keywords: ["pasta", "spaghetti", "macaroni", "penne", "lasagne", "tagliatelle"], step: "Een grote pan water aan de kook brengen..." },
  { keywords: ["rijst", "risotto"], step: "De rijst spoelen en koken..." },
  { keywords: ["aardappel", "puree", "frietjes"], step: "De aardappels schillen..." },
  { keywords: ["saus", "tomatensaus", "pesto", "room"], step: "De saus zachtjes laten pruttelen..." },
  { keywords: ["knoflook", "ui"], step: "Knoflook en ui fijn snijden..." },
  { keywords: ["kruiden", "peterselie", "basilicum", "bieslook", "tijm", "rozemarijn"], step: "Verse kruiden hakken..." },
  { keywords: ["kaas", "mozzarella", "parmezaan", "feta"], step: "De kaas raspen..." },
  { keywords: ["deeg", "brood", "pannenkoek", "pannenkoeken", "wafel"], step: "Het beslag goed mengen..." },
  { keywords: ["soep"], step: "De soep laten trekken..." },
  { keywords: ["smoothie", "shake", "sap"], step: "Alles in de blender doen..." },
  { keywords: ["sla", "salade"], step: "De salade luchtig mengen..." },
];

function buildSteps(context?: string | null): string[] {
  const lower = (context ?? "").toLowerCase();
  const matched = CONDITIONAL_STEPS
    .filter(({ keywords }) => keywords.some((k) => lower.includes(k)))
    .map(({ step }) => step);

  // Dedupe while preserving order
  const seen = new Set<string>();
  const unique = matched.filter((s) => (seen.has(s) ? false : (seen.add(s), true)));

  // Combine: relevant steps first, then a few generic ones to fill the rotation
  const combined = [...unique, ...GENERIC_STEPS];
  return combined.length > 0 ? combined : GENERIC_STEPS;
}

export const RecipeLoadingDialog = ({ open, phase, context }: RecipeLoadingDialogProps) => {
  const steps = useMemo(() => buildSteps(context), [context]);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    setStepIndex(0);
    const interval = setInterval(() => {
      setStepIndex((i) => (i + 1) % steps.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [open, steps]);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  const title =
    phase === "image"
      ? "Mandy genereert nu een mooie foto..."
      : "Mandy bedenkt een lekker recept...";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 animate-fade-in"
    >
      <div className="bg-[#FAF8F5] rounded-3xl shadow-2xl max-w-md w-full p-8 text-center border-4 border-[#F08400]">
        <div className="flex justify-center mb-4">
          <BlenderLoader size={160} intervalMs={600} />
        </div>
        <h2 className="text-2xl font-bold font-poster uppercase text-[#F08400] mb-3">
          {title}
        </h2>
        <p
          key={stepIndex}
          className="text-black font-poster text-base min-h-[3rem] animate-fade-in"
        >
          {steps[stepIndex]}
        </p>
        <p className="mt-4 text-sm text-black/60 font-poster">
          Even geduld, dit duurt meestal maar een paar seconden!
        </p>
      </div>
    </div>
  );
};

export default RecipeLoadingDialog;
