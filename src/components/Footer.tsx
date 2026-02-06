import { Phone, Mail, MapPin, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import schoolfruitLogo from "@/assets/schoolfruit-logo.png";

const Footer = () => {
  return (
    <footer className="bg-muted/30 mt-auto">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Logo */}
          <img 
            src={schoolfruitLogo} 
            alt="Schoolfruit.nl" 
            className="h-20 w-auto"
          />

          {/* Contact */}
          <ul className="space-y-2 text-sm text-muted-foreground">
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
              <span>Van der Kaaijstraat 64, 1815VM Alkmaar</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-sm">
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
