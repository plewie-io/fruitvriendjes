import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, ChefHat, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateRecipe as generateRecipeAI, generatePhotoPrompt, generateRecipePhoto } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import mandarijn from "@/assets/mandarijn.png";
import recipeBackground from "@/assets/recipe-background.jpg";
const RecipeGenerator = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState<string | null>(null);
  const [recipeImage, setRecipeImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const {
    toast
  } = useToast();
  const generateRecipe = async () => {
    if (!ingredients.trim()) {
      toast({
        title: "Vergeet je ingrediënten niet!",
        description: "Typ eerst wat groenten of fruit in.",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    setRecipe(null);
    setRecipeImage(null);
    try {
      // Step 1: Generate the recipe
      const recipeText = await generateRecipeAI(ingredients.trim());
      setRecipe(recipeText);
      toast({
        title: "Recept klaar! 🎉",
        description: "Nu maken we een mooie foto..."
      });

      // Step 2: Generate photo prompt from recipe
      setImageLoading(true);
      const photoPrompt = await generatePhotoPrompt(recipeText);
      
      // Step 3: Generate the actual image
      const imageUrl = await generateRecipePhoto(photoPrompt);
      setRecipeImage(imageUrl);
      setImageLoading(false);
      
      toast({
        title: "Foto klaar! 📸",
        description: "Veel kookplezier!"
      });
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
                  Welke ingrediënten heb je?
                </label>
                <Input id="ingredients" value={ingredients} onChange={e => setIngredients(e.target.value)} placeholder="Bijv: appels, bananen, aardbeien..." className="text-lg" onKeyDown={e => {
                if (e.key === "Enter" && !loading) {
                  generateRecipe();
                }
              }} />
              </div>

              <Button onClick={generateRecipe} disabled={loading} className="w-full text-lg py-6" size="lg">
                {loading ? <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Recept maken...
                  </> : <>
                    <ChefHat className="mr-2 h-5 w-5" />
                    Maak een recept!
                  </>}
              </Button>
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