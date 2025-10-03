import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, ChefHat, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLocation, useNavigate } from "react-router-dom";
import pineappleFriend from "@/assets/pineapple-friend.jpg";
import appleFriend from "@/assets/apple-friend.jpg";
import bananaFriend from "@/assets/banana-friend.jpg";
import strawberryFriend from "@/assets/strawberry-friend.jpg";

const friendImages: Record<string, string> = {
  pineapple: pineappleFriend,
  apple: appleFriend,
  banana: bananaFriend,
  strawberry: strawberryFriend,
};

const RecipeGenerator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const friend = location.state?.friend || "pineapple";
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateRecipe = async () => {
    if (!ingredients.trim()) {
      toast({
        title: "Vergeet je ingrediënten niet!",
        description: "Typ eerst wat groenten of fruit in.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setRecipe(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-recipe", {
        body: { ingredients: ingredients.trim() },
      });

      if (error) throw error;

      setRecipe(data.recipe);
      toast({
        title: "Recept klaar! 🎉",
        description: "Veel kookplezier!",
      });
    } catch (error: any) {
      console.error("Error generating recipe:", error);
      toast({
        title: "Oeps!",
        description: "Er ging iets mis. Probeer het nog eens.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Terug
        </Button>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <img
              src={friendImages[friend]}
              alt={`${friend} vriend`}
              className="w-32 h-48 mx-auto mb-4 object-contain animate-fade-in"
            />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              Maak een lekker recept!
            </h1>
            <p className="text-lg text-muted-foreground">
              Vertel me welke groenten of fruit je hebt, en ik maak er een leuk recept van!
            </p>
          </div>

          <Card className="p-6 shadow-playful">
            <div className="space-y-4">
              <div>
                <label htmlFor="ingredients" className="block text-sm font-medium mb-2">
                  Welke ingrediënten heb je?
                </label>
                <Input
                  id="ingredients"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="Bijv: appels, bananen, aardbeien..."
                  className="text-lg"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !loading) {
                      generateRecipe();
                    }
                  }}
                />
              </div>

              <Button
                onClick={generateRecipe}
                disabled={loading}
                className="w-full text-lg py-6"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Recept maken...
                  </>
                ) : (
                  <>
                    <ChefHat className="mr-2 h-5 w-5" />
                    Maak een recept!
                  </>
                )}
              </Button>
            </div>
          </Card>

          {recipe && (
            <Card className="mt-6 p-6 shadow-float animate-fade-in bg-card">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <ChefHat className="h-6 w-6 text-primary" />
                Jouw recept:
              </h2>
              <div className="prose prose-lg max-w-none whitespace-pre-wrap">
                {recipe}
              </div>
            </Card>
          )}

          <div className="mt-8 p-4 bg-accent/20 rounded-lg border-2 border-accent">
            <p className="text-sm text-center text-accent-foreground">
              ⚠️ <strong>Belangrijk:</strong> Vraag altijd een volwassene om hulp bij het koken!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeGenerator;
