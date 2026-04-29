import { useEffect, useState } from "react";
import { CarrotHourglassLoader } from "./CarrotHourglassLoader";

interface RecipeLoadingDialogProps {
  open: boolean;
  phase: "recipe" | "image";
}

const FUN_FACTS = [
  "Wist je dat een wortel ooit paars was? Pas later werd hij oranje!",
  "Eet je de schil van een appel mee? Dan krijg je extra vitamines!",
  "Bananen groeien aan een soort kruid, niet aan een boom.",
  "Aardbeien zijn officieel geen bessen. Verrassend hè?",
  "Komkommer bestaat voor 95% uit water. Echt waar!",
  "Een tomaat is eigenlijk fruit, geen groente.",
  "Broccoli zit boordevol vitamine C, zelfs meer dan een sinaasappel.",
];

export const RecipeLoadingDialog = ({ open, phase }: RecipeLoadingDialogProps) => {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    setFactIndex(Math.floor(Math.random() * FUN_FACTS.length));
    const interval = setInterval(() => {
      setFactIndex((i) => (i + 1) % FUN_FACTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [open]);

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
      ? "Mandy tekent nu een mooie foto..."
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
          <CarrotHourglassLoader size={160} />
        </div>
        <h2 className="text-2xl font-bold font-poster uppercase text-[#F08400] mb-3">
          {title}
        </h2>
        <p className="text-black font-poster text-base min-h-[3rem] transition-opacity duration-300">
          {FUN_FACTS[factIndex]}
        </p>
        <p className="mt-4 text-sm text-black/60 font-poster">
          Even geduld, dit duurt meestal maar een paar seconden!
        </p>
      </div>
    </div>
  );
};

export default RecipeLoadingDialog;
