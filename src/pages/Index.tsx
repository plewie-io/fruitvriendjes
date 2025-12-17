import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { SchoolfruitsHeader } from "@/components/SchoolfruitsHeader";
import Footer from "@/components/Footer";
import { ArrowUp } from "lucide-react";
import mandarijn from "@/assets/mandarijn.png";
import cookingFamily from "@/assets/cooking-family.png";

const Index = () => {
  const navigate = useNavigate();
  const [showSafetyDialog, setShowSafetyDialog] = useState(true);

  const goToRecipe = () => {
    navigate("/recept");
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
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
              <p className="font-semibold">Veel kookplezier! 🍊🍎🍓</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-background hover:bg-background/90 text-foreground">Begrepen!</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container mx-auto px-4 py-6 md:py-12">
        <div className="text-center mb-6 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">De Fruitvriendjes!</h1>
          <p className="text-lg md:text-2xl text-muted-foreground animate-fade-in">
            Klik op Mandy om samen een lekker recept te maken!
          </p>
        </div>

        <div className="flex justify-center max-w-4xl mx-auto">
          <Card
            className="overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-float animate-fade-in w-full border-4 border-card"
            onClick={goToRecipe}
          >
            <div 
              className="relative flex flex-col md:flex-row items-center justify-center md:justify-between px-4 md:px-8 py-6"
              style={{
                backgroundImage: `linear-gradient(rgba(240, 132, 0, 0.85), rgba(240, 132, 0, 0.85)), url(${cookingFamily})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="flex flex-col items-center z-10 mb-6 md:mb-0">
                <Button className="text-lg md:text-xl py-4 md:py-6 px-8 md:px-12 bg-white/70 backdrop-blur-sm text-foreground hover:bg-white/80 border-4 border-white/50" size="lg">
                  Kook met mij!
                </Button>
                <button 
                  onClick={goToRecipe}
                  className="flex flex-col items-center gap-1 mt-4 text-card hover:scale-110 transition-transform animate-bounce"
                >
                  <ArrowUp className="w-10 md:w-12 h-10 md:h-12" />
                  <span className="text-base md:text-lg font-semibold">Klik hier!</span>
                </button>
              </div>
              <div className="flex flex-col items-center z-10">
                <div className="bg-white/70 backdrop-blur-sm w-56 h-56 md:w-80 md:h-80 rounded-lg flex items-center justify-center">
                  <img
                    src={mandarijn}
                    alt="Mandy Mandarijn"
                    className="w-52 h-60 md:w-72 md:h-[340px] object-contain drop-shadow-lg"
                  />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-card mt-4">Mandy Mandarijn</h3>
              </div>
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
      <Footer />
    </div>
  );
};

export default Index;
