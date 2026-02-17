import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { SchoolfruitsHeader } from "@/components/SchoolfruitsHeader";
import Footer from "@/components/Footer";
import { SchoolfruitChatbot } from "@/components/SchoolfruitChatbot";
import { Loader2, ChefHat, Undo2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateRecipe as generateRecipeAI, generateRecipePhoto, modifyRecipe, saveRecipeGeneration, getCurrentSessionId, signInAndCreateSession } from "@/lib/firebase";
import ReactMarkdown from "react-markdown";
import golfje from "@/assets/golfje-appel-dubbel.png";
import masterchefMandy from "@/assets/masterchef-mandy.png";

type RecipeHistoryItem = {
  recipe: string;
  image: string | null;
  recipeId: string | null;
};

const Index = () => {
  const [showSafetyDialog, setShowSafetyDialog] = useState(() => {
    return !localStorage.getItem('safetyDialogShown');
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
    localStorage.setItem('safetyDialogShown', 'true');
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
    setRecipeHistory(prev => prev.slice(0, -1));
    toast({ title: "Vorige versie hersteld", description: "Je ziet nu het vorige recept." });
  };

  const handleSubmit = async () => {
    if (!ingredients.trim()) {
      toast({
        title: isModifyMode ? "Wat wil je aanpassen?" : "Vergeet je ingrediënten niet!",
        description: isModifyMode ? "Typ eerst wat je wilt veranderen." : "Typ eerst wat groenten of fruit in.",
        variant: "destructive"
      });
      return;
    }
    if (isModifyMode && recipe) {
      await handleModifyRecipe();
    } else {
      await generateRecipe();
    }
  };

  const handleModifyRecipe = async () => {
    if (!recipe) return;
    const previousRecipe = recipe;
    const previousIngredients = ingredients.trim();
    setRecipeHistory(prev => [...prev, { recipe, image: recipeImage, recipeId: currentRecipeId }]);
    setRecipe(null);
    setRecipeImage(null);
    setLoading(true);
    try {
      const recipeResponse = await modifyRecipe(previousRecipe, previousIngredients);
      setRecipe(recipeResponse.recipe);
      setIngredients("");
      let newImageUrl: string | null = null;
      if (recipeResponse.isValidRequest && recipeResponse.imagePrompt) {
        toast({ title: "Recept aangepast! 🎉", description: "Nu maken we een nieuwe foto..." });
        setImageLoading(true);
        newImageUrl = await generateRecipePhoto(recipeResponse.imagePrompt);
        setRecipeImage(newImageUrl);
        setImageLoading(false);
        toast({ title: "Foto klaar! 📸", description: "Veel kookplezier!" });
      } else {
        toast({ title: "Recept aangepast! 🎉", description: "Veel kookplezier!" });
      }
      if (getCurrentSessionId()) {
        try {
          const newRecipeId = await saveRecipeGeneration(previousIngredients, recipeResponse.recipe, recipeResponse.imagePrompt || "", newImageUrl, true, currentRecipeId);
          setCurrentRecipeId(newRecipeId);
        } catch (saveError) {
          console.error("Error saving recipe:", saveError);
        }
      }
    } catch (error: any) {
      console.error("Error modifying recipe:", error);
      toast({ title: "Oeps!", description: "Er ging iets mis. Probeer het nog eens.", variant: "destructive" });
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
      const recipeResponse = await generateRecipeAI(userIngredients, "mandy-mandarijn");
      setRecipe(recipeResponse.recipe);
      setIngredients("");
      setIsModifyMode(true);
      let imageUrl: string | null = null;
      if (recipeResponse.isValidRequest && recipeResponse.imagePrompt) {
        toast({ title: "Recept klaar! 🎉", description: "Nu maken we een mooie foto..." });
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
          const newRecipeId = await saveRecipeGeneration(userIngredients, recipeResponse.recipe, recipeResponse.imagePrompt || "", imageUrl, false, null);
          setCurrentRecipeId(newRecipeId);
        } catch (saveError) {
          console.error("Error saving recipe:", saveError);
        }
      }
    } catch (error: any) {
      console.error("Error generating recipe:", error);
      toast({ title: "Oeps!", description: "Er ging iets mis. Probeer het nog eens.", variant: "destructive" });
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
            <AlertDialogTitle className="text-2xl">⚠️ Veilig koken met kinderen</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 text-base">
              <p>Leuk dat je samen met je kind (of kinderen) gaat koken! Houd hierbij rekening met het volgende:</p>
              <ul className="list-disc list-inside space-y-2 text-foreground">
                <li>Wees voorzichtig met scherpe keukenartikelen zoals messen en scharen</li>
                <li>Let op hete pannen en ovens</li>
                <li>Houd rekening met allergieën en voedselintoleranties</li>
                <li>Was altijd je handen voordat je begint</li>
              </ul>
              <p className="font-semibold">Veel kookplezier! 🍊🍎🍓</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-background hover:bg-background/90 text-foreground">Begrepen!</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Green banner */}
      <div className="bg-background py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1 font-poster uppercase">
            MANDY MANDARIJN
          </h1>
          <p className="text-lg text-white font-bold font-poster uppercase">
            IK HELP JOU IN DE KEUKEN!
          </p>
        </div>
      </div>
      {/* Golfje transition */}
      <div className="w-full -mt-1">
        <img src={golfje} alt="" className="w-full block" aria-hidden="true" />
      </div>

      <main className="flex-1 bg-[#FAF8F5]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">

            {/* Intro section with Mandy */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
              <p className="text-sm md:text-base font-bold uppercase leading-relaxed md:flex-1">
                Jij vertelt welke groente, fruit en andere ingrediënten je in huis hebt en ik bedenk daar een leuk en lekker recept mee dat je makkelijk kunt maken. Zo maken we samen een leuke maaltijd van wat er al in de keuken ligt!
              </p>
              <img
                src={masterchefMandy}
                alt="Masterchef Mandy Mandarijn"
                className="w-40 h-40 md:w-48 md:h-48 object-contain"
              />
            </div>

            {/* Recipe input section */}
            <div className="max-w-xl mx-auto text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold uppercase mb-4 font-poster">
                {isModifyMode ? "Wat wil je aanpassen?" : "Wat zullen we vandaag maken?"}
              </h2>

              <Input
                id="ingredients"
                value={ingredients}
                onChange={e => setIngredients(e.target.value)}
                placeholder={isModifyMode ? "Bijv: maak het vegetarisch, voeg noten toe..." : "Typ hier..."}
                className="text-lg text-center border-2 border-mandy-orange text-mandy-orange placeholder:text-mandy-orange/60 bg-white py-6 font-poster"
                disabled={loading || imageLoading}
                onKeyDown={e => {
                  if (e.key === "Enter" && !loading && !imageLoading) {
                    handleSubmit();
                  }
                }}
              />

              <p className="text-sm mt-3 text-foreground">
                Vertel mij wat je wilt eten óf welke groente, fruit en andere ingrediënten je al in huis heb, dan maak ik er een lekker recept van!
              </p>

              <div className="mt-4 space-y-2">
                {!loading && !imageLoading ? (
                  <>
                    <Button onClick={handleSubmit} className="w-full text-lg py-6 bg-mandy-orange hover:bg-mandy-orange/90 font-poster uppercase" size="lg">
                      <ChefHat className="mr-2 h-5 w-5" />
                      {isModifyMode ? "Pas recept aan!" : "Maak een recept!"}
                    </Button>

                    {isModifyMode && (
                      <div className="flex gap-2">
                        {recipeHistory.length > 0 && (
                          <Button variant="outline" onClick={handleUndo} className="flex-1 border-mandy-orange text-mandy-orange hover:bg-mandy-orange/10">
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
                  <Button disabled className="w-full text-lg py-6 bg-mandy-orange font-poster uppercase" size="lg">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {imageLoading ? "Foto maken..." : (isModifyMode ? "Recept aanpassen..." : "Recept maken...")}
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
                {imageLoading && (
                  <div className="flex items-center justify-center py-8 mb-4 bg-mandy-orange-light rounded-xl">
                    <Loader2 className="h-8 w-8 animate-spin text-mandy-orange mr-2" />
                    <span className="text-muted-foreground">Foto maken...</span>
                  </div>
                )}
                {recipeImage && (
                  <div className="mb-4">
                    <img src={recipeImage} alt="Recept foto" className="w-full rounded-xl shadow-md" />
                  </div>
                )}
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown>{recipe}</ReactMarkdown>
                </div>
              </Card>
            )}

            {/* Tip */}
            <div className="max-w-xl mx-auto text-center mb-8">
              <p className="text-xs font-bold uppercase">
                Tip: Is het recept nog niet naar wens? Typ in wat je wilt wijzigen en Mandy past het aan!
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom green section with golfje on top */}
      <div className="w-full rotate-180 -mb-1">
        <img src={golfje} alt="" className="w-full block" aria-hidden="true" />
      </div>
      <div className="bg-background py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white font-poster uppercase">
            Op zoek naar meer inspiratie? Bekijk onze recepten!
          </h2>
        </div>
      </div>

      <Footer />
      <SchoolfruitChatbot />
    </div>
  );
};

export default Index;
