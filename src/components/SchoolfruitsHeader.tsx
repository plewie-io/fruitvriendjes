import { ExternalLink } from "lucide-react";
import aardbei from "@/assets/aardbei.png";
import banaan from "@/assets/banaan.png";
import appel from "@/assets/appel.png";
import sinaasappel from "@/assets/sinaasappel.png";

export const SchoolfruitsHeader = () => {
  return (
    <header className="bg-card shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo section */}
          <a 
            href="https://www.schoolfruit.nl/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-end -space-x-2">
              <img src={banaan} alt="" className="w-8 h-12 object-contain" />
              <img src={sinaasappel} alt="" className="w-10 h-14 object-contain" />
              <img src={appel} alt="" className="w-8 h-12 object-contain" />
              <img src={aardbei} alt="" className="w-7 h-10 object-contain" />
            </div>
            <span className="text-xl font-bold text-foreground ml-2">SCHOOLFRUIT.NL</span>
          </a>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <a 
              href="https://www.schoolfruit.nl/producten" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              PRODUCTEN
            </a>
            <a 
              href="https://www.schoolfruit.nl/nieuws" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              NIEUWS
            </a>
            <a 
              href="https://www.schoolfruit.nl/over-ons" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              OVER ONS
            </a>
            <a 
              href="https://www.schoolfruit.nl/contact" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              NEEM CONTACT OP
            </a>
          </nav>

          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.schoolfruit.nl/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">BEZOEK WEBSITE</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Green bar */}
      <div className="h-2 bg-background" />
    </header>
  );
};
