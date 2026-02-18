import { Phone, Mail, MapPin, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import schoolfruitLogo from "@/assets/schoolfruit-logo.png";

const Footer = () => {
  return (
    <footer className="bg-background mt-auto">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Logo */}
          <div className="flex flex-col items-start">
            <a href="https://www.schoolfruit.nl/" target="_blank" rel="noopener noreferrer">
              <img src={schoolfruitLogo} alt="Schoolfruit.nl" className="h-14 w-auto mb-1" />
            </a>
            <span className="text-[10px] text-mandy-orange font-poster uppercase italic">Voor een stralende dag</span>
          </div>

          {/* Eten op school */}
          <div>
            <h4 className="font-poster uppercase text-foreground font-bold mb-2 text-xs">Eten op school</h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li><a href="https://www.schoolfruit.nl/schoolfruit/" target="_blank" rel="noopener noreferrer" className="hover:text-mandy-orange transition-colors">Schoolfruit</a></li>
              <li><a href="https://www.schoolfruit.nl/lunchgroente/" target="_blank" rel="noopener noreferrer" className="hover:text-mandy-orange transition-colors">Lunchgroente</a></li>
              <li><a href="https://www.schoolfruit.nl/ontbijt-en-lunchboodschappen/" target="_blank" rel="noopener noreferrer" className="hover:text-mandy-orange transition-colors">Ontbijt- en Lunchboodschappen</a></li>
              <li><a href="https://www.schoolfruit.nl/vakantiepakketten/" target="_blank" rel="noopener noreferrer" className="hover:text-mandy-orange transition-colors">Vakantiepakketten</a></li>
              <li><a href="https://www.schoolfruit.nl/boodschappenpakketten/" target="_blank" rel="noopener noreferrer" className="hover:text-mandy-orange transition-colors">Boodschappenpakketten</a></li>
            </ul>
          </div>

          {/* Meer info */}
          <div>
            <h4 className="font-poster uppercase text-foreground font-bold mb-2 text-xs">Meer info</h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li><a href="https://www.schoolfruit.nl/veelgestelde-vragen/" target="_blank" rel="noopener noreferrer" className="hover:text-mandy-orange transition-colors">Veelgestelde vragen</a></li>
              <li><a href="https://www.schoolfruit.nl/nieuws/" target="_blank" rel="noopener noreferrer" className="hover:text-mandy-orange transition-colors">Nieuws</a></li>
              <li><a href="https://www.schoolfruit.nl/recepten/" target="_blank" rel="noopener noreferrer" className="hover:text-mandy-orange transition-colors">Recepten</a></li>
              <li><a href="https://www.schoolfruit.nl/plan-een-afspraak/" target="_blank" rel="noopener noreferrer" className="hover:text-mandy-orange transition-colors">Plan een afspraak</a></li>
              <li><a href="https://www.schoolfruit.nl/inloggen/" target="_blank" rel="noopener noreferrer" className="hover:text-mandy-orange transition-colors">Inloggen</a></li>
            </ul>
          </div>

          {/* Over schoolfruit.nl */}
          <div>
            <h4 className="font-poster uppercase text-foreground font-bold mb-2 text-xs">Over schoolfruit.nl</h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li><a href="https://www.schoolfruit.nl/vacatures/" target="_blank" rel="noopener noreferrer" className="hover:text-mandy-orange transition-colors">Vacatures</a></li>
              <li><a href="https://www.schoolfruit.nl/ons-verhaal/" target="_blank" rel="noopener noreferrer" className="hover:text-mandy-orange transition-colors">Ons verhaal</a></li>
              <li><a href="https://www.schoolfruit.nl/contact/" target="_blank" rel="noopener noreferrer" className="hover:text-mandy-orange transition-colors">Neem contact op</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-poster uppercase text-foreground font-bold mb-2 text-xs">Contact</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-mandy-orange flex-shrink-0" />
                <span>085 06 40 761</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-mandy-orange flex-shrink-0" />
                <a href="mailto:info@schoolfruit.nl" className="hover:text-mandy-orange transition-colors">info@schoolfruit.nl</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-mandy-orange mt-0.5 flex-shrink-0" />
                <span>Van der Kaaijstraat 64<br />1815VM, Alkmaar</span>
              </li>
            </ul>
            {/* Social icons */}
            <div className="flex gap-3 mt-4">
              <a href="https://www.instagram.com/schoolfruit.nl/" target="_blank" rel="noopener noreferrer" className="text-mandy-orange hover:opacity-70 transition-opacity">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/schoolfruit/" target="_blank" rel="noopener noreferrer" className="text-mandy-orange hover:opacity-70 transition-opacity">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://www.youtube.com/@schoolfruitnl" target="_blank" rel="noopener noreferrer" className="text-mandy-orange hover:opacity-70 transition-opacity">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-mandy-orange text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-xs">
            <a href="https://www.schoolfruit.nl/nl/pages/privacy/" target="_blank" rel="noopener noreferrer" className="hover:underline">Privacy Statement</a>
            <span>EDUrebls en HandiHow</span>
            <Link to="/admin" className="hover:underline flex items-center gap-1">
              <Settings className="h-4 w-4" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;