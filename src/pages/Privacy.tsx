import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Footer from "@/components/Footer";
import { SchoolfruitsHeader } from "@/components/SchoolfruitsHeader";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SchoolfruitsHeader />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl relative">
        <button
          onClick={() => navigate("/")}
          className="absolute top-8 right-4 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Sluiten"
        >
          <X className="h-6 w-6" />
        </button>
        <h1 className="font-poster text-3xl text-foreground uppercase mb-6">Privacyverklaring de Fruitvriendjes</h1>
        <h2 className="font-poster text-xl text-mandy-orange uppercase mb-4">aangeboden door Schoolfruit</h2>
        <p className="text-xs text-muted-foreground mb-6">Versie: februari 2026</p>

        <p className="text-sm text-foreground mb-6">
          Welkom bij de Fruitvriendjes! Dit is een kookomgeving voor ouders en kinderen, aangeboden door Schoolfruit. Via onze chatbot kunnen jullie samen leuke fruitrecepten ontdekken en koken. We vinden het belangrijk dat je weet hoe we omgaan met gegevens. Dat leggen we hier kort en helder uit.
        </p>

        <Section title="Wat voor omgeving is dit?">
          De Fruitvriendjes is een interactieve receptenomgeving. Ouders en kinderen kunnen via de chatbot vragen stellen over fruitrecepten en bereidingswijzen. Er worden geen persoonlijke gegevens gevraagd of opgeslagen — alleen de receptvragen die je intypt worden tijdelijk verwerkt om een antwoord te kunnen geven.
        </Section>

        <Section title="Welke gegevens verwerken wij?">
          <p className="mb-3">Omdat de Fruitvriendjes geen account of inlog vereist, verzamelen wij zo min mogelijk gegevens. Wij kunnen de volgende technische gegevens verwerken:</p>
          <ul className="list-disc pl-5 space-y-1 mb-3">
            <li>IP-adres (voor de beveiliging van de verbinding)</li>
            <li>De tekst van jouw receptvraag aan de chatbot (tijdelijk, zie bewaartermijn)</li>
          </ul>
          <p>Wij vragen niet om namen, e-mailadressen of andere persoonsgegevens. Voer deze ook zelf niet in bij de chatbot.</p>
        </Section>

        <Section title="Waarom verwerken wij deze gegevens?">
          <p className="mb-3">Schoolfruit gebruikt de Fruitvriendjes-omgeving ook om van te leren en de dienstverlening te verbeteren. De gestelde receptvragen kunnen daarvoor — volledig anoniem — worden geanalyseerd.</p>
          <p className="mb-3">Samengevat verwerken wij gegevens voor:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Het laten functioneren van de chatbot en het tonen van recepten</li>
            <li>Het beveiligen van de verbinding</li>
            <li>Het anoniem analyseren van chatinteracties om de dienst te verbeteren</li>
          </ul>
        </Section>

        <Section title="Hoe lang bewaren wij gegevens?">
          Chatberichten (receptvragen) worden maximaal 3 maanden bewaard. Technische gegevens zoals IP-adressen bewaren wij zo kort als nodig is voor de beveiliging. Daarna worden de gegevens automatisch verwijderd.
        </Section>

        <Section title="Delen wij gegevens met anderen?">
          Nee, niet voor commerciële doeleinden. Schoolfruit deelt gegevens alleen met technische partijen die nodig zijn om de dienst te laten werken, en uitsluitend op basis van een verwerkersovereenkomst. Jouw gegevens worden nooit verkocht of verhuurd.
        </Section>

        <Section title="Beveiliging">
          De verbinding met de Fruitvriendjes is beveiligd via HTTPS/SSL. Wij nemen passende maatregelen om gegevens te beschermen tegen onbevoegde toegang of verlies.
        </Section>

        <Section title="Jouw rechten">
          Op basis van de AVG heb je recht op inzage, rectificatie en verwijdering van jouw gegevens. Wil je hier gebruik van maken of heb je een vraag? Stuur dan een e-mail naar <a href="mailto:privacy@schoolfruit.nl" className="text-mandy-orange hover:underline">privacy@schoolfruit.nl</a>. Wij reageren binnen 4 weken.
        </Section>

        <Section title="Wijzigingen">
          Schoolfruit kan deze privacyverklaring aanpassen. De meest actuele versie is altijd te vinden op onze website. We raden je aan om deze af en toe te bekijken.
        </Section>

        <hr className="my-8 border-border" />

        <h2 className="font-poster text-2xl text-foreground uppercase mb-6">Disclaimer – Recepten via de Fruitvriendjes-chatbot</h2>

        <p className="text-sm text-foreground mb-6">
          De recepten en bereidingswijzen die de Fruitvriendjes-chatbot genereert, worden automatisch aangemaakt door kunstmatige intelligentie. Hieronder lees je wat dat betekent voor het gebruik.
        </p>

        <Section title="AI-gegenereerde content">
          De chatbot is geen gecertificeerde voedingsdeskundige of kok. De recepten zijn bedoeld als inspiratie voor thuis koken, met en voor kinderen. Aan de gegenereerde output kunnen geen rechten worden ontleend. Schoolfruit garandeert niet dat recepten altijd volledig juist, veilig of geschikt zijn voor iedereen.
        </Section>

        <Section title="Allergieën en voedselveiligheid">
          De chatbot houdt geen rekening met allergieën, intoleranties of dieetwensen, tenzij je dit zelf aangeeft in jouw vraag. Controleer ingrediënten altijd zelf op allergenen, zeker als je kookt voor kinderen. Bij twijfel over voeding en gezondheid: raadpleeg altijd een arts of diëtist.
        </Section>

        <Section title="Beperking van aansprakelijkheid">
          <p className="mb-3">Het gebruik van de Fruitvriendjes-chatbot en de gegenereerde recepten is voor eigen risico. Schoolfruit aanvaardt geen aansprakelijkheid voor schade die voortvloeit uit het gebruik van of vertrouwen op AI-gegenereerde recepten. Hieronder valt onder meer schade als gevolg van:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>onjuiste of onvolledige receptinformatie;</li>
            <li>allergische reacties of voedselgerelateerde gezondheidsklachten;</li>
            <li>letsel of schade bij het bereiden van recepten.</li>
          </ul>
        </Section>

        <Section title="Toezicht door een volwassene">
          De Fruitvriendjes is bedoeld om samen met een ouder of verzorger te gebruiken. Kinderen dienen altijd onder begeleiding te koken. Schoolfruit is niet verantwoordelijk voor het onbegeleid gebruik van de chatbot door minderjarigen.
        </Section>

        <Section title="Geen vervanging van professioneel advies">
          De recepten en informatie van de chatbot zijn geen vervanging voor professioneel voedings- of gezondheidsadvies. Raadpleeg altijd een deskundige bij specifieke vragen over voeding, allergieën of gezondheid.
        </Section>

        <Section title="Intellectueel eigendom">
          De content van de Fruitvriendjes, inclusief de chatbottechnologie, het ontwerp en de recepten, is eigendom van Schoolfruit en/of haar partners. Gebruik van deze content zonder toestemming is niet toegestaan.
        </Section>

        <p className="text-sm text-foreground mt-8 mb-4">
          Door gebruik te maken van de Fruitvriendjes ga je akkoord met deze disclaimer en de bijbehorende privacyverklaring.
        </p>

        <p className="text-sm text-foreground mb-2">
          Heb je vragen of opmerkingen? Neem dan contact op via{" "}
          <a href="mailto:privacy@schoolfruit.nl" className="text-mandy-orange hover:underline">privacy@schoolfruit.nl</a>.
        </p>

        <p className="text-xs text-muted-foreground mt-6">
          Ook beschikbaar als{" "}
          <a href="/privacyverklaring_fruitvriendjes.pdf" target="_blank" rel="noopener noreferrer" className="text-mandy-orange hover:underline">
            PDF-download
          </a>.
        </p>
      </main>
      <Footer />
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-6">
    <h3 className="font-poster text-lg text-foreground uppercase mb-2">{title}</h3>
    <div className="text-sm text-foreground leading-relaxed">{children}</div>
  </section>
);

export default Privacy;
