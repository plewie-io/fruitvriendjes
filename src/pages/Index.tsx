import { useState, useEffect } from "react";
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

import { Loader2, ChefHat, Undo2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  generateRecipe as generateRecipeAI,
  generateRecipePhoto,
  modifyRecipe,
  saveRecipeGeneration,
  getCurrentSessionId,
  signInAndCreateSession,
} from "@/lib/firebase";
import ReactMarkdown from "react-markdown";
import golfje from "@/assets/Golfje_Appel_dubbel.svg";
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
  const { toast } = useToast();

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

      {/* Green banner with wave as bottom edge */}
      <div className="relative" style={{ backgroundColor: "#B3CA17" }}>
        <div className="container mx-auto max-w-4xl text-left px-4 py-3">
          <h1 className="text-3xl md:text-2xl font-bold text-white mb-0 font-poster uppercase whitespace-nowrap">
            MANDY MANDARIJN
          </h1>
          <p className="text-lg md:text-base text-white font-bold font-poster">
            Ik help jou in de keuken!
          </p>
        </div>
        <div style={{ lineHeight: 0 }}>
          <img
            src={golfje}
            alt=""
            className="w-full block"
            style={{ transform: "scaleY(-1)" }}
          />
        </div>
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
              </Card>
            )}

          </div>
        </div>
      </main>

      {/* Inspiratie section with inline SVG waves - no image gaps */}
      <div>
        {/* Wave: cream → green */}
        <div style={{ lineHeight: 0 }}>
          <img
            src={golfje}
            alt=""
            className="w-full block"
          />
        </div>

        {/* Green inspiratie section */}
        <div
          className="py-12 md:py-10 px-4"
          style={{ backgroundColor: "#B3CA17" }}
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
