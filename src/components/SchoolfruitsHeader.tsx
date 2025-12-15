import { ExternalLink, CalendarDays } from "lucide-react";
import schoolfruitLogo from "@/assets/schoolfruit-logo.png";

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
            className="hover:opacity-80 transition-opacity"
          >
            <img src={schoolfruitLogo} alt="Schoolfruit.nl" className="h-14 object-contain" />
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
              className="flex items-center gap-2 bg-mandy-orange text-card px-4 py-2 rounded-full font-semibold text-sm hover:bg-mandy-orange/90 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">BEZOEK WEBSITE</span>
            </a>
            <a
              href="https://schoolfruitnl.zohobookings.eu/#/customer/kennismaken"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity"
            >
              <div className="w-12 h-12 bg-mandy-orange rounded-full flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-card" />
              </div>
              <span className="text-xs font-bold text-foreground hidden sm:block">PLAN EEN AFSPRAAK</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Green bar */}
      <div className="h-2 bg-background" />
    </header>
  );
};
