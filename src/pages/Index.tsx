import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SchoolfruitsHeader } from "@/components/SchoolfruitsHeader";
import Footer from "@/components/Footer";

import { Loader2, ChefHat, Undo2, Download, ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  generateRecipe as generateRecipeAI,
  generateRecipePhoto,
  modifyRecipe,
  saveRecipeGeneration,
  saveRecipeFeedback,
  getCurrentSessionId,
  signInAndCreateSession,
} from "@/lib/firebase";
import ReactMarkdown from "react-markdown";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import golfje from "@/assets/golfje-appel-dubbel.png";
import masterchefMandy from "@/assets/masterchef-mandy.png";
import golfjeBottom from "@/assets/golfje-bottom.png";
import arrowLimoen from "@/assets/SF_doodle_arrow6_limoen_PNG.png";

type RecipeHistoryItem = {
  recipe: string;
  image: string | null;
  recipeId: string | null;
};

const Index = () => {
  const [showSafetyDialog, setShowSafetyDialog] = useState(() => {
    return !sessionStorage.getItem("safetyDialogShown");
  });
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState<string | null>(null);
  const [recipeImage, setRecipeImage] = useState<string | null>(null);
  const [recipeHistory, setRecipeHistory] = useState<RecipeHistoryItem[]>([]);
  const [currentRecipeId, setCurrentRecipeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const recipeCardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleFeedback = async (value: "up" | "down") => {
    if (!currentRecipeId || feedback) return;
    setFeedback(value);
    try {
      await saveRecipeFeedback(currentRecipeId, value);
      toast({
        title: "Bedankt voor je feedback! 🙏",
        description: value === "up" ? "Fijn dat je het recept leuk vond!" : "We doen ons best om beter te worden.",
      });
    } catch (error) {
      console.error("Error saving feedback:", error);
      setFeedback(null);
      toast({ title: "Oeps!", description: "Feedback kon niet worden opgeslagen.", variant: "destructive" });
    }
  };

  const handleDownloadPdf = async () => {
    if (!recipeCardRef.current) return;
    setDownloadingPdf(true);
    try {
      const canvas = await html2canvas(recipeCardRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight <= pageHeight - margin * 2) {
        pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
      } else {
        // multi-page
        let remainingHeight = imgHeight;
        let position = margin;
        const maxPageHeight = pageHeight - margin * 2;
        while (remainingHeight > 0) {
          pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
          remainingHeight -= maxPageHeight;
          if (remainingHeight > 0) {
            pdf.addPage();
            position = margin - (imgHeight - remainingHeight);
          }
        }
      }
      pdf.save("mandy-recept.pdf");
    } catch (error) {
      console.error("PDF error:", error);
      toast({ title: "Oeps!", description: "PDF maken is niet gelukt.", variant: "destructive" });
    } finally {
      setDownloadingPdf(false);
    }
  };

  // ... keep existing code (handleDialogClose, useEffect, handleUndo, handleSubmit, handleModifyRecipe, generateRecipe)
  const handleDialogClose = () => {
    sessionStorage.setItem("safetyDialogShown", "true");
    setShowSafetyDialog(false);
  };

  useEffect(() => {
    const initSession = async () => {
      try {
        await signInAndCreateSession("mandy-mandarijn");
        setSessionReady(true);
      } catch (error) {
        console.error("Error starting session:", error);
        setSessionReady(true);
      }
    };
    initSession();
  }, []);

  const handleUndo = () => {
    if (recipeHistory.length === 0) return;
    const previousVersion = recipeHistory[recipeHistory.length - 1];
    setRecipe(previousVersion.recipe);
    setRecipeImage(previousVersion.image);
    setCurrentRecipeId(previousVersion.recipeId);
    setRecipeHistory((prev) => prev.slice(0, -1));
    toast({
      title: "Vorige versie hersteld",
      description: "Je ziet nu het vorige recept.",
    });
  };

  const handleSubmit = async () => {
    if (!ingredients.trim()) {
      toast({
        title: isModifyMode
          ? "Wat wil je aanpassen?"
          : "Vergeet je ingrediënten niet!",
        description: isModifyMode
          ? "Typ eerst wat je wilt veranderen."
          : "Typ eerst wat groenten of fruit in.",
        variant: "destructive",
      });
      return;
    }
    if (isModifyMode && recipe) {
      await handleModifyRecipe();
    } else {
      // If in modify mode but no recipe exists (e.g. previous attempt failed), generate fresh
      if (isModifyMode && !recipe) {
        setIsModifyMode(false);
      }
      await generateRecipe();
    }
  };

  const handleModifyRecipe = async () => {
    if (!recipe) return;
    const previousRecipe = recipe;
    const previousIngredients = ingredients.trim();
    setRecipeHistory((prev) => [
      ...prev,
      { recipe, image: recipeImage, recipeId: currentRecipeId },
    ]);
    setRecipe(null);
    setRecipeImage(null);
    setFeedback(null);
    setLoading(true);
    try {
      const recipeResponse = await modifyRecipe(
        previousRecipe,
        previousIngredients,
      );
      setRecipe(recipeResponse.recipe);
      setIngredients("");
      let newImageUrl: string | null = null;
      if (recipeResponse.isValidRequest && recipeResponse.imagePrompt) {
        toast({
          title: "Recept aangepast! 🎉",
          description: "Nu maken we een nieuwe foto...",
        });
        setImageLoading(true);
        newImageUrl = await generateRecipePhoto(recipeResponse.imagePrompt);
        setRecipeImage(newImageUrl);
        setImageLoading(false);
        toast({ title: "Foto klaar! 📸", description: "Veel kookplezier!" });
      } else {
        toast({
          title: "Recept aangepast! 🎉",
          description: "Veel kookplezier!",
        });
      }
      if (getCurrentSessionId()) {
        try {
          const newRecipeId = await saveRecipeGeneration(
            previousIngredients,
            recipeResponse.recipe,
            recipeResponse.imagePrompt || "",
            newImageUrl,
            true,
            currentRecipeId,
          );
          setCurrentRecipeId(newRecipeId);
        } catch (saveError) {
          console.error("Error saving recipe:", saveError);
        }
      }
    } catch (error: any) {
      console.error("Error modifying recipe:", error);
      toast({
        title: "Oeps!",
        description: "Er ging iets mis. Probeer het nog eens.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setImageLoading(false);
    }
  };

  const generateRecipe = async () => {
    if (!ingredients.trim()) return;
    const userIngredients = ingredients.trim();
    setLoading(true);
    setRecipe(null);
    setRecipeImage(null);
    setRecipeHistory([]);
    setCurrentRecipeId(null);
    setFeedback(null);
    try {
      const recipeResponse = await generateRecipeAI(
        userIngredients,
        "mandy-mandarijn",
      );
      setRecipe(recipeResponse.recipe);
      setIngredients("");
      setIsModifyMode(true);
      let imageUrl: string | null = null;
      if (recipeResponse.isValidRequest && recipeResponse.imagePrompt) {
        toast({
          title: "Recept klaar! 🎉",
          description: "Nu maken we een mooie foto...",
        });
        setImageLoading(true);
        imageUrl = await generateRecipePhoto(recipeResponse.imagePrompt);
        setRecipeImage(imageUrl);
        setImageLoading(false);
        toast({ title: "Foto klaar! 📸", description: "Veel kookplezier!" });
      } else {
        toast({ title: "Recept klaar! 🎉", description: "Veel kookplezier!" });
      }
      if (getCurrentSessionId()) {
        try {
          const newRecipeId = await saveRecipeGeneration(
            userIngredients,
            recipeResponse.recipe,
            recipeResponse.imagePrompt || "",
            imageUrl,
            false,
            null,
          );
          setCurrentRecipeId(newRecipeId);
        } catch (saveError) {
          console.error("Error saving recipe:", saveError);
        }
      }
    } catch (error: any) {
      console.error("Error generating recipe:", error);
      toast({
        title: "Oeps!",
        description: "Er ging iets mis. Probeer het nog eens.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setImageLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <SchoolfruitsHeader />

      <AlertDialog open={showSafetyDialog} onOpenChange={handleDialogClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">
              ⚠️ Veilig koken met kinderen
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 text-base">
              <ul className="list-disc list-inside space-y-2 text-foreground">
                <li>Kook altijd samen met een volwassene.</li>
                <li>Lees het recept vooraf door.</li>
                <li>
                  Wees voorzichtig met scherpe keukenspullen, zoals messen en
                  scharen.
                </li>
                <li>Let op met hete pannen, kookplaten en ovens.</li>
                <li>Houd rekening met allergieën en intoleranties.</li>
                <li>Was je handen voor je begint.</li>
              </ul>
              <p className="text-foreground">
                Veel kookplezier! Recepten zijn slechts suggesties, dus
                controleer altijd zelf of ze geschikt zijn voor jouw kind.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-[#DB7202] hover:bg-[#DB7202]/90 text-white">
              Begrepen!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Green banner */}
      <div
        className="py-12 md:py-8 px-4"
        style={{ backgroundColor: "#F08400" }}
      >
        <div className="container mx-auto max-w-4xl text-left">
          <h1 className="text-3xl md:text-2xl font-bold text-white mb-1 md:mb-0 font-poster uppercase whitespace-nowrap">
            MANDY MANDARIJN
          </h1>
          <p className="text-lg md:text-base text-white font-bold font-poster">
            Ik help jou in de keuken!
          </p>
        </div>
      </div>
      {/* SVG wave: green → cream */}
      <div style={{ backgroundColor: "#F08400", lineHeight: 0 }}>
        <svg
          viewBox="0 0 1440 16"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: "16px" }}
        >
          <path
            d="M0,8 C3,0 27,16 30,8 C37,0 53,16 60,8 C74,0 76,16 90,8 C97,3 113,13 120,8 C122,0 148,16 150,8 C157,0 173,16 180,8 C183,0 207,16 210,8 C217,0 233,16 240,8 C254,0 256,16 270,8 C277,3 293,13 300,8 C302,0 328,16 330,8 C337,0 353,16 360,8 C363,0 387,16 390,8 C397,0 413,16 420,8 C434,0 436,16 450,8 C457,3 473,13 480,8 C482,0 508,16 510,8 C517,0 533,16 540,8 C543,0 567,16 570,8 C577,0 593,16 600,8 C614,0 616,16 630,8 C637,3 653,13 660,8 C662,0 688,16 690,8 C697,0 713,16 720,8 C723,0 747,16 750,8 C757,0 773,16 780,8 C794,0 796,16 810,8 C817,3 833,13 840,8 C842,0 868,16 870,8 C877,0 893,16 900,8 C903,0 927,16 930,8 C937,0 953,16 960,8 C974,0 976,16 990,8 C997,3 1013,13 1020,8 C1022,0 1048,16 1050,8 C1057,0 1073,16 1080,8 C1083,0 1107,16 1110,8 C1117,0 1133,16 1140,8 C1154,0 1156,16 1170,8 C1177,3 1193,13 1200,8 C1202,0 1228,16 1230,8 C1237,0 1253,16 1260,8 C1263,0 1287,16 1290,8 C1297,0 1313,16 1320,8 C1334,0 1336,16 1350,8 C1357,3 1373,13 1380,8 C1382,0 1408,16 1410,8 C1417,0 1433,16 1440,8 L1440,16 L0,16 Z"
            fill="#FAF8F5"
          />
        </svg>
      </div>

      <main className="flex-1 bg-[#FAF8F5]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Intro section with Mandy */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-4">
              <p className="font-poster leading-relaxed md:flex-1 text-black">
                Jij vertelt welke groente, fruit en andere boodschappen je in
                huis hebt en ik bedenk daar een leuk en lekker recept mee dat je
                makkelijk kunt maken. Zo maken we samen een leuke maaltijd van
                wat er al in de keuken ligt!
              </p>
              <div className="relative w-56 h-56 md:w-64 md:h-64">
                <img
                  src={masterchefMandy}
                  alt="Masterchef Mandy Mandarijn"
                  className="absolute top-4 left-4 w-36 h-36 md:w-40 md:h-40 object-contain"
                />
                <img
                  src={arrowLimoen}
                  alt=""
                  className="absolute bottom-0 right-0 w-16 h-20 object-contain arrow-wiggle"
                />
              </div>
            </div>

            {/* Recipe input section */}
            <div className="max-w-xl mx-auto text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold uppercase mb-4 font-poster text-black">
                {isModifyMode
                  ? "Wat wil je aanpassen?"
                  : "Wat zullen we vandaag maken?"}
              </h2>
              {!isModifyMode && (
                <div className="text-black mb-4">
                  <p className="font-semibold">Typ in waar je trek in hebt of welke boodschappen je nog in huis hebt, dan maak ik een lekker recept voor je!</p>
                  <p className="mt-2 font-semibold">Tip van de Masterchef: <span className="font-normal">Is mijn recept nog niet helemaal naar wens? Typ gewoon in wat je wilt wijzigen of toevoegen, dan pas ik het voor je aan!</span></p>
                </div>
              )}

              <Input
                id="ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder={
                  isModifyMode
                    ? "Bijv: maak het vegetarisch, voeg noten toe..."
                    : "Typ hier..."
                }
                className="text-lg text-center border-2 border-mandy-orange text-mandy-orange placeholder:text-mandy-orange/60 bg-white py-6"
                disabled={loading || imageLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading && !imageLoading) {
                    handleSubmit();
                  }
                }}
              />


              <div className="mt-4 space-y-2">
                {!loading && !imageLoading ? (
                  <>
                    <Button
                      onClick={handleSubmit}
                      className="w-full text-lg py-6 bg-mandy-orange hover:bg-mandy-orange/90 font-poster uppercase"
                      size="lg"
                    >
                      <ChefHat className="mr-2 h-5 w-5" />
                      {isModifyMode ? "Pas recept aan!" : "Maak een recept!"}
                    </Button>

                    {isModifyMode && (
                      <div className="flex gap-2">
                        {recipeHistory.length > 0 && (
                          <Button
                            variant="outline"
                            onClick={handleUndo}
                            className="flex-1 border-mandy-orange text-mandy-orange hover:bg-mandy-orange/10"
                          >
                            <Undo2 className="mr-2 h-4 w-4" />
                            Vorige versie
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          onClick={() => {
                            setRecipe(null);
                            setRecipeImage(null);
                            setRecipeHistory([]);
                            setCurrentRecipeId(null);
                            setFeedback(null);
                            setIsModifyMode(false);
                            setIngredients("");
                          }}
                          className="flex-1 border-mandy-orange text-mandy-orange hover:bg-mandy-orange/10"
                        >
                          Nieuw recept maken
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <Button
                    disabled
                    className="w-full text-lg py-6 bg-mandy-orange font-poster uppercase"
                    size="lg"
                  >
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {imageLoading
                      ? "Foto maken..."
                      : isModifyMode
                        ? "Recept aanpassen..."
                        : "Recept maken..."}
                  </Button>
                )}
              </div>
            </div>

            {/* Recipe result */}
            {recipe && (
              <Card className="max-w-xl mx-auto p-6 shadow-float animate-fade-in bg-white mb-8">
                <div ref={recipeCardRef} className="bg-white">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 font-poster">
                    <ChefHat className="h-6 w-6 text-mandy-orange" />
                    Jouw recept:
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <ReactMarkdown>{recipe}</ReactMarkdown>
                  </div>
                  {imageLoading && (
                    <div className="flex items-center justify-center py-8 mt-4 bg-mandy-orange-light rounded-xl">
                      <Loader2 className="h-8 w-8 animate-spin text-mandy-orange mr-2" />
                      <span className="text-muted-foreground">Foto maken...</span>
                    </div>
                  )}
                  {recipeImage && (
                    <div className="mt-4">
                      <img
                        src={recipeImage}
                        alt="Recept foto"
                        className="w-full rounded-xl shadow-md"
                      />
                    </div>
                  )}
                </div>

                {/* Feedback */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3">
                    <span className="font-poster font-bold text-black text-center sm:text-left">
                      Wat vond je van dit recept?
                    </span>
                    <div className="flex gap-2 justify-center">
                      <Button
                        onClick={() => handleFeedback("up")}
                        disabled={!!feedback || !currentRecipeId}
                        className={`bg-brand-green hover:bg-brand-green/90 text-white ${feedback === "up" ? "ring-2 ring-offset-2 ring-brand-green" : ""} ${feedback === "down" ? "opacity-40" : ""}`}
                        size="icon"
                        aria-label="Duim omhoog"
                      >
                        <ThumbsUp className="h-5 w-5" />
                      </Button>
                      <Button
                        onClick={() => handleFeedback("down")}
                        disabled={!!feedback || !currentRecipeId}
                        className={`bg-destructive hover:bg-destructive/90 text-destructive-foreground ${feedback === "down" ? "ring-2 ring-offset-2 ring-destructive" : ""} ${feedback === "up" ? "opacity-40" : ""}`}
                        size="icon"
                        aria-label="Duim omlaag"
                      >
                        <ThumbsDown className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Download PDF */}
                <div className="mt-4">
                  <Button
                    onClick={handleDownloadPdf}
                    disabled={downloadingPdf}
                    className="w-full text-lg py-6 bg-mandy-orange hover:bg-mandy-orange/90 font-poster uppercase"
                    size="lg"
                  >
                    {downloadingPdf ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-5 w-5" />
                    )}
                    Download je recept als PDF
                  </Button>
                </div>
              </Card>
            )}

          </div>
        </div>
      </main>

      {/* Inspiratie section with inline SVG waves - no image gaps */}
      <div>
        {/* Wave: cream → green */}
        <div style={{ backgroundColor: "#FAF8F5", lineHeight: 0 }}>
          <svg
            viewBox="0 0 1440 16"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            style={{ display: "block", width: "100%", height: "16px" }}
          >
            <path
              d="M0,8 C3,16 27,0 30,8 C37,16 53,0 60,8 C74,16 76,0 90,8 C97,13 113,3 120,8 C122,16 148,0 150,8 C157,16 173,0 180,8 C183,16 207,0 210,8 C217,16 233,0 240,8 C254,16 256,0 270,8 C277,13 293,3 300,8 C302,16 328,0 330,8 C337,16 353,0 360,8 C363,16 387,0 390,8 C397,16 413,0 420,8 C434,16 436,0 450,8 C457,13 473,3 480,8 C482,16 508,0 510,8 C517,16 533,0 540,8 C543,16 567,0 570,8 C577,16 593,0 600,8 C614,16 616,0 630,8 C637,13 653,3 660,8 C662,16 688,0 690,8 C697,16 713,0 720,8 C723,16 747,0 750,8 C757,16 773,0 780,8 C794,16 796,0 810,8 C817,13 833,3 840,8 C842,16 868,0 870,8 C877,16 893,0 900,8 C903,16 927,0 930,8 C937,16 953,0 960,8 C974,16 976,0 990,8 C997,13 1013,3 1020,8 C1022,16 1048,0 1050,8 C1057,16 1073,0 1080,8 C1083,16 1107,0 1110,8 C1117,16 1133,0 1140,8 C1154,16 1156,0 1170,8 C1177,13 1193,3 1200,8 C1202,16 1228,0 1230,8 C1237,16 1253,0 1260,8 C1263,16 1287,0 1290,8 C1297,16 1313,0 1320,8 C1334,16 1336,0 1350,8 C1357,13 1373,3 1380,8 C1382,16 1408,0 1410,8 C1417,16 1433,0 1440,8 L1440,16 L0,16 Z"
              fill="#F08400"
            />
          </svg>
        </div>

        {/* Green inspiratie section */}
        <div
          className="py-12 md:py-10 px-4"
          style={{ backgroundColor: "#F08400" }}
        >
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-2xl md:text-xl font-bold text-white font-poster uppercase">
              Op zoek naar meer inspiratie? Bekijk{" "}
              <a
                href="https://www.schoolfruit.nl/recepten"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-2 underline-offset-4 hover:opacity-80 transition-opacity"
              >
                onze recepten!
              </a>
            </h2>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
