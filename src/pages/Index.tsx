import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FruitFriendsHeader } from "@/components/FruitFriendsHeader";
import pineappleFriend from "@/assets/pineapple-friend.jpg";
import appleFriend from "@/assets/apple-friend.jpg";
import bananaFriend from "@/assets/banana-friend.jpg";
import strawberryFriend from "@/assets/strawberry-friend.jpg";

const friends = [
  { id: "pineapple", name: "Anna Ananas", image: pineappleFriend, color: "from-orange-400 to-yellow-400" },
  { id: "apple", name: "Appie Appel", image: appleFriend, color: "from-green-400 to-lime-400" },
  { id: "banana", name: "Bert Banaan", image: bananaFriend, color: "from-yellow-300 to-yellow-500" },
  { id: "strawberry", name: "Sanne Aardbei", image: strawberryFriend, color: "from-red-500 to-pink-500" },
];

const Index = () => {
  const navigate = useNavigate();

  const selectFriend = (friendId: string) => {
    navigate("/recept", { state: { friend: friendId } });
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-12">
        <FruitFriendsHeader />
        
        <div className="text-center mb-12">
          <p className="text-xl md:text-2xl text-muted-foreground animate-fade-in">
            Kies jouw favoriete fruitvriend en maak samen een lekker recept!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {friends.map((friend, index) => (
            <Card
              key={friend.id}
              className="overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-float animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => selectFriend(friend.id)}
            >
              <div className={`h-32 bg-gradient-to-br ${friend.color}`} />
              <div className="p-6 text-center">
                <img
                  src={friend.image}
                  alt={friend.name}
                  className="w-24 h-36 mx-auto -mt-20 mb-4 object-contain drop-shadow-lg"
                />
                <h3 className="text-2xl font-bold mb-2">{friend.name}</h3>
                <Button className="w-full mt-4" size="lg">
                  Kies mij!
                </Button>
              </div>
            </Card>
          ))}
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
