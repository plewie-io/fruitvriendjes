import { Phone, Mail, MapPin } from "lucide-react";
import schoolfruitLogo from "@/assets/schoolfruit-logo.png";

const Footer = () => {
  return (
    <footer className="bg-muted/30 mt-auto">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo */}
          <div className="lg:col-span-1">
            <img 
              src={schoolfruitLogo} 
              alt="Schoolfruit.nl" 
              className="h-24 w-auto mb-4"
            />
          </div>

          {/* Onze Producten */}
          <div>
            <h3 className="font-bold text-primary mb-4 uppercase tracking-wide text-sm">
              Onze Producten
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Schoolfruit</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Lunchgroente</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Ontbijt/lunchpakket</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Maandpakketten</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Vakantiepakketten</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Houdbare pakketten</a></li>
            </ul>
          </div>

          {/* Meer Info */}
          <div>
            <h3 className="font-bold text-primary mb-4 uppercase tracking-wide text-sm">
              Meer Info
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Veel gestelde vragen</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Nieuws</a></li>
            </ul>
          </div>

          {/* Over Schoolfruit */}
          <div>
            <h3 className="font-bold text-primary mb-4 uppercase tracking-wide text-sm">
              Over Schoolfruit
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Over ons</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Vacatures</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Het team</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Ons verhaal</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Neem contact op</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-primary mb-4 uppercase tracking-wide text-sm">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>085 06 40 761</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@schoolfruit.nl</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>Van der Kaaijstraat 64<br />1815VM, Alkmaar</span>
              </li>
            </ul>
            {/* Social Icons */}
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-sm">
            <a href="https://www.schoolfruit.nl/nl/pages/privacy/" target="_blank" rel="noopener noreferrer" className="hover:underline">Privacy Statement</a>
            <span>EDUrebls en Handyhow</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
