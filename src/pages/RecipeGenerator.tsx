import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, ChefHat, ArrowLeft, Undo2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateRecipe as generateRecipeAI, generateRecipePhoto, modifyRecipe, saveRecipeGeneration, getCurrentSessionId } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import recipeBackground from "@/assets/recipe-background.jpg";
type RecipeHistoryItem = {
  recipe: string;
  image: string | null;
  recipeId: string | null;
};

const RecipeGenerator = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState<string | null>(null);
  const [recipeImage, setRecipeImage] = useState<string | null>(null);
  const [recipeHistory, setRecipeHistory] = useState<RecipeHistoryItem[]>([]);
  const [currentRecipeId, setCurrentRecipeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [isModifyMode, setIsModifyMode] = useState(false);
  const {
    toast
  } = useToast();

  const handleUndo = () => {
    if (recipeHistory.length === 0) return;
    
    const previousVersion = recipeHistory[recipeHistory.length - 1];
    setRecipe(previousVersion.recipe);
    setRecipeImage(previousVersion.image);
    setCurrentRecipeId(previousVersion.recipeId);
    setRecipeHistory(prev => prev.slice(0, -1));
    
    toast({
      title: "Vorige versie hersteld",
      description: "Je ziet nu het vorige recept."
    });
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
    
    // Save current state to history before modifying
    const previousRecipe = recipe;
    const previousIngredients = ingredients.trim();
    setRecipeHistory(prev => [...prev, { recipe, image: recipeImage, recipeId: currentRecipeId }]);
    
    // Clear current recipe and image to show loading state
    setRecipe(null);
    setRecipeImage(null);
    
    setLoading(true);
    try {
      const recipeResponse = await modifyRecipe(previousRecipe, previousIngredients);
      setRecipe(recipeResponse.recipe);
      setIngredients("");

      let newImageUrl: string | null = null;

      // Generate new image if valid
      if (recipeResponse.isValidRequest && recipeResponse.imagePrompt) {
        toast({
          title: "Recept aangepast! 🎉",
          description: "Nu maken we een nieuwe foto..."
        });
        
        setImageLoading(true);
        newImageUrl = await generateRecipePhoto(recipeResponse.imagePrompt);
        setRecipeImage(newImageUrl);
        setImageLoading(false);
        
        toast({
          title: "Foto klaar! 📸",
          description: "Veel kookplezier!"
        });
      } else {
        toast({
          title: "Recept aangepast! 🎉",
          description: "Veel kookplezier!"
        });
      }

      // Save to database
      if (getCurrentSessionId()) {
        try {
          const newRecipeId = await saveRecipeGeneration(
            previousIngredients,
            recipeResponse.recipe,
            recipeResponse.imagePrompt || "",
            newImageUrl,
            true,
            currentRecipeId
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
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setImageLoading(false);
    }
  };

  const generateRecipe = async () => {
    if (!ingredients.trim()) {
      toast({
        title: "Vergeet je ingrediënten niet!",
        description: "Typ eerst wat groenten of fruit in.",
        variant: "destructive"
      });
      return;
    }
    
    const userIngredients = ingredients.trim();
    setLoading(true);
    setRecipe(null);
    setRecipeImage(null);
    setRecipeHistory([]);
    setCurrentRecipeId(null);
    
    try {
      // Step 1: Generate the recipe (returns both recipe and imagePrompt)
      const recipeResponse = await generateRecipeAI(userIngredients, "mandy-mandarijn");
      setRecipe(recipeResponse.recipe);
      setIngredients("");
      setIsModifyMode(true);

      let imageUrl: string | null = null;

      // Step 2: Generate the actual image only if isValidRequest is true
      if (recipeResponse.isValidRequest && recipeResponse.imagePrompt) {
        toast({
          title: "Recept klaar! 🎉",
          description: "Nu maken we een mooie foto..."
        });
        
        setImageLoading(true);
        imageUrl = await generateRecipePhoto(recipeResponse.imagePrompt);
        setRecipeImage(imageUrl);
        setImageLoading(false);
        
        toast({
          title: "Foto klaar! 📸",
          description: "Veel kookplezier!"
        });
      } else {
        toast({
          title: "Recept klaar! 🎉",
          description: "Veel kookplezier!"
        });
      }

      // Save to database
      if (getCurrentSessionId()) {
        try {
          const newRecipeId = await saveRecipeGeneration(
            userIngredients,
            recipeResponse.recipe,
            recipeResponse.imagePrompt || "",
            imageUrl,
            false, // isModification
            null   // previousRecipeId
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
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setImageLoading(false);
    }
  };
  return <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{
    backgroundImage: `url(${recipeBackground})`
  }}>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Terug
        </Button>

        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <div className="text-center mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-4 w-full max-w-xl">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
              Hoi, ik ben Mandy Mandarijn!
            </h1>
            <p className="text-sm text-muted-foreground">
              Vertel me welke groenten of fruit je hebt, en ik maak er een leuk recept van!
            </p>
          </div>

          <Card className="p-8 shadow-playful w-full max-w-xl">
            <div className="space-y-4">
              <div>
                <label htmlFor="ingredients" className="block text-sm font-medium mb-2">
                  {isModifyMode ? "Wat wil je aanpassen?" : "Welke ingrediënten heb je?"}
                </label>
                <Input 
                  id="ingredients" 
                  value={ingredients} 
                  onChange={e => setIngredients(e.target.value)} 
                  placeholder={isModifyMode ? "Bijv: maak het vegetarisch, voeg noten toe..." : "Bijv: appels, bananen, aardbeien..."} 
                  className="text-lg" 
                  disabled={loading || imageLoading}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !loading && !imageLoading) {
                      handleSubmit();
                    }
                  }} 
                />
              </div>

              {!loading && !imageLoading ? (
                <>
                  <Button onClick={handleSubmit} className="w-full text-lg py-6" size="lg">
                    <ChefHat className="mr-2 h-5 w-5" />
                    {isModifyMode ? "Pas recept aan!" : "Maak een recept!"}
                  </Button>

                  {isModifyMode && (
                    <div className="flex gap-2">
                      {recipeHistory.length > 0 && (
                        <Button 
                          variant="outline" 
                          onClick={handleUndo}
                          className="flex-1"
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
                        className="flex-1"
                      >
                        Nieuw recept maken
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <Button disabled className="w-full text-lg py-6" size="lg">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {imageLoading ? "Foto maken..." : (isModifyMode ? "Recept aanpassen..." : "Recept maken...")}
                </Button>
              )}
            </div>
          </Card>

          {recipe && <Card className="mt-6 p-6 shadow-float animate-fade-in bg-card">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <ChefHat className="h-6 w-6 text-primary" />
                Jouw recept:
              </h2>
              
              {/* Recipe Image */}
              {imageLoading && (
                <div className="flex items-center justify-center py-8 mb-4 bg-gray-100 rounded-xl">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                  <span className="text-muted-foreground">Foto maken...</span>
                </div>
              )}
              {recipeImage && (
                <div className="mb-4">
                  <img 
                    src={recipeImage} 
                    alt="Recept foto" 
                    className="w-full rounded-xl shadow-md"
                  />
                </div>
              )}
              
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown>{recipe}</ReactMarkdown>
              </div>
            </Card>}

          <div className="mt-8 p-4 bg-white/80 backdrop-blur-sm rounded-2xl w-full max-w-xl">
            <p className="text-sm text-center text-foreground">⚠️ Belangrijk: hou altijd toezicht op je kind (of kinderen)! Kook nooit alleen.<strong>Belangrijk:</strong> Vraag altijd een volwassene om hulp bij het koken!
            </p>
          </div>
        </div>
      </div>
    </div>;
};
export default RecipeGenerator;