import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { FruitFriendsHeader } from "@/components/FruitFriendsHeader";
import { SchoolfruitsHeader } from "@/components/SchoolfruitsHeader";
import { ArrowUp } from "lucide-react";
import mandarijn from "@/assets/mandarijn.png";

const Index = () => {
  const navigate = useNavigate();
  const [showSafetyDialog, setShowSafetyDialog] = useState(true);

  const goToRecipe = () => {
    navigate("/recept");
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <SchoolfruitsHeader />
      <AlertDialog open={showSafetyDialog} onOpenChange={setShowSafetyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">⚠️ Veilig koken met kinderen</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 text-base">
              <p>Leuk dat je samen met je kinderen gaat koken! Houd hierbij rekening met het volgende:</p>
              <ul className="list-disc list-inside space-y-2 text-foreground">
                <li>Wees voorzichtig met scherpe keukenartikelen zoals messen en scharen</li>
                <li>Let op hete pannen en ovens</li>
                <li>Houd rekening met allergieën en voedselintoleranties</li>
                <li>Was altijd je handen voordat je begint</li>
              </ul>
              <p className="font-semibold">Veel kookplezier! 🍳👨‍🍳👩‍🍳</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-background hover:bg-background/90 text-foreground">Begrepen!</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container mx-auto px-4 py-12">
        <FruitFriendsHeader />
        
        <div className="text-center mb-12">
          <p className="text-xl md:text-2xl text-muted-foreground animate-fade-in">
            Klik op Mandy om samen een lekker recept te maken!
          </p>
        </div>

        <div className="flex justify-center max-w-3xl mx-auto">
          <Card
            className="overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-float animate-fade-in w-full border-4 border-card"
            onClick={goToRecipe}
          >
            <div className="bg-mandy-orange flex flex-col items-center py-6">
              <Button className="text-xl py-6 px-12 bg-card text-foreground hover:bg-card/90 border-4 border-card" size="lg">
                Kook met mij!
              </Button>
              <button 
                onClick={goToRecipe}
                className="flex flex-col items-center gap-1 mt-4 text-card hover:scale-110 transition-transform animate-bounce"
              >
                <ArrowUp className="w-12 h-12" />
                <span className="text-lg font-semibold">Klik hier!</span>
              </button>
            </div>
            <div className="p-10 bg-card flex flex-col items-start">
              <img
                src={mandarijn}
                alt="Mandy Mandarijn"
                className="w-96 h-[450px] object-contain drop-shadow-lg"
              />
              <h3 className="text-4xl font-bold mt-4 ml-16">Mandy Mandarijn</h3>
            </div>
          </Card>
        </div>

        <div className="mt-16 max-w-2xl mx-auto">
          <Card className="p-6 bg-muted/50">
            <h2 className="text-2xl font-bold mb-4 text-center">Hoe werkt het?</h2>
            <ol className="space-y-3 text-lg">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">1</span>
                <span>Kies jouw favoriete fruitvriend hierboven</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">2</span>
                <span>Typ welke groenten of fruit je hebt</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">3</span>
                <span>Krijg een leuk en lekker recept om te maken!</span>
              </li>
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
