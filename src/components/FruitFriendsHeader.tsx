import { useNavigate } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import aardbei from "@/assets/aardbei.png";
import ananas from "@/assets/ananas.png";
import appel from "@/assets/appel.png";
import banaan from "@/assets/banaan.png";
import peer from "@/assets/peer.png";
import sinaasappel from "@/assets/sinaasappel.png";

const friends = [
  { id: "strawberry", name: "Sanne Aardbei", image: aardbei },
  { id: "pineapple", name: "Anna Ananas", image: ananas },
  { id: "apple", name: "Appie Appel", image: appel },
  { id: "banana", name: "Bert Banaan", image: banaan },
  { id: "pear", name: "Pieter Peer", image: peer },
  { id: "orange", name: "Oscar Sinaasappel", image: sinaasappel },
];

export const FruitFriendsHeader = () => {
  const navigate = useNavigate();

  const selectFriend = (friendId: string) => {
    navigate("/recept", { state: { friend: friendId } });
  };

  return (
    <div className="mb-8">
      <h1 className="text-5xl md:text-6xl font-bold text-foreground animate-fade-in text-center mb-8">
        De Fruitvriendjes!
      </h1>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-2xl mx-auto"
      >
        <CarouselContent>
          {friends.map((friend, index) => (
            <CarouselItem key={friend.id} className="basis-1/3">
              <div
                className="relative group cursor-pointer animate-fade-in flex justify-center"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => selectFriend(friend.id)}
              >
                <img
                  src={friend.image}
                  alt={friend.name}
                  className="w-20 h-32 object-contain transition-all duration-300 group-hover:animate-[wiggle_0.5s_ease-in-out] group-hover:scale-110"
                />
                
                {/* Speech bubble */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                  <div className="bg-card rounded-2xl px-4 py-2 shadow-float border-2 border-primary relative">
                    <p className="text-sm font-bold text-foreground whitespace-nowrap">
                      Kies mij!!
                    </p>
                    {/* Triangle pointer */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-card"></div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-10 border-r-10 border-t-10 border-l-transparent border-r-transparent border-t-primary"></div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
