import schoolfruitLogo from "@/assets/schoolfruit-logo.png";

export const SchoolfruitsHeader = () => {
  return (
    <header className="bg-[#FAF8F5]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-6">
          {/* Logo section */}
          <a 
            href="https://www.schoolfruit.nl/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <img src={schoolfruitLogo} alt="Schoolfruit.nl" className="h-16 object-contain" />
          </a>

          {/* CTA button */}
          <a
            href="https://www.schoolfruit.nl/"
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-mandy-orange text-mandy-orange px-6 py-3 font-bold text-sm tracking-wide hover:bg-mandy-orange hover:text-white transition-colors"
          >
            NAAR SCHOOLFRUIT.NL
          </a>
        </div>
      </div>
    </header>
  );
};
