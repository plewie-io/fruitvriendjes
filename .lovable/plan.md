## Waarom de huidige PDF zo slecht is

De PDF die je hebt getest komt van de oude route `/recept`, waar nog `html2canvas` wordt gebruikt. Die maakt één grote PNG-screenshot van de hele receptkaart en plakt die in de PDF. Daardoor:

- bestand wordt ~15 MB;
- tekst is een afbeelding (niet selecteerbaar);
- inhoud kan dubbel verschijnen door verkeerde paginabreaks;
- bestandsnaam klopt niet (vaste naam i.p.v. recepttitel).

De nieuwe versie wordt volledig tekstgebaseerd met `jsPDF`, met de receptfoto als enige afbeelding (gecomprimeerd).

## Plan

### 1. Eén centrale PDF-functie

Ik maak `src/lib/recipePdf.ts` met één functie `downloadRecipePdf(recipeMarkdown, recipeImage)` die overal gebruikt wordt.

### 2. Oude screenshot-code verwijderen

In `src/pages/RecipeGenerator.tsx` haal ik de `html2canvas`-aanpak weg en laat die ook de nieuwe centrale functie gebruiken. Daardoor kan er nooit meer per ongeluk een screenshot-PDF uit de app komen.

In `src/pages/Index.tsx` vervang ik de huidige inline PDF-code door een aanroep naar de nieuwe functie.

### 3. Recepttitel goed extraheren

- Eerste markdown-kop (`#`, `##` of `###`) wordt de titel.
- Markdown-tekens en emoji worden opgeruimd.
- Generieke koppen zoals “Jouw recept” worden overgeslagen.
- Titel wordt zowel in de PDF-kop als in de bestandsnaam gebruikt, bijvoorbeeld:

```text
# Appel-banaan pannenkoekjes  ->  appel-banaan-pannenkoekjes.pdf
```

### 4. Dubbele tekst voorkomen

- De PDF leest de markdown direct, niet de zichtbare HTML-kaart, dus “Jouw recept:” uit de UI komt er niet meer in.
- De titel wordt maar één keer geplaatst.
- Lege en exact herhaalde regels worden gefilterd.

### 5. Nette opmaak in merkstijl

- Smalle oranje (#F08400) bovenbalk.
- Grote recepttitel in oranje.
- Kopjes oranje en vet, tekst zwart.
- Bullets met oranje punt.
- Genummerde stappen met oranje nummer.
- Goede marges, regelafstand en automatische paginabreaks.
- Footer met “Fruitvriendjes • Mandy Mandarijn” en paginanummer.

### 6. Receptfoto blijft behouden, maar klein

De foto blijft in de PDF, maar wordt sterk geoptimaliseerd:

- automatisch verkleind tot max ~700 px aan de langste zijde;
- opgeslagen als JPEG met ~55% kwaliteit;
- één keer geplaatst, gecentreerd onder de titel met een maximale hoogte zodat hij niet de hele pagina vult;
- bij CORS-problemen wordt de foto netjes overgeslagen zonder dat de hele PDF faalt.

Hierdoor wordt de PDF normaal gesproken een paar honderd KB tot maximaal ~1–2 MB in plaats van 15 MB.

### 7. Knop en gebruikerservaring

- Knop blijft onderaan met tekst “Download je recept als PDF”.
- Tijdens genereren toont de knop een laadstatus.
- Na succes een korte bevestiging via toast; bij fout een nette foutmelding.

### 8. Opruimen

Als `html2canvas` na de wijzigingen nergens meer gebruikt wordt, verwijder ik de dependency uit `package.json` om de bundle kleiner te maken.

## Technische details

- Tekst wordt geschreven met `jsPDF.text(...)` op A4, marges ~18 mm.
- Markdown-parsing herkent: `#`/`##`/`###` koppen, `-`/`*`/`+` bullets, `1.` nummering, paragrafen.
- Inline `**vet**`, `*cursief*` en backticks worden gestript.
- Foto wordt via een offscreen `<canvas>` herschaald en als JPEG (`toDataURL("image/jpeg", 0.55)`) ingevoegd met `pdf.addImage(..., "JPEG", ..., "FAST")`.
- Geheugen: alleen één gecomprimeerde foto, geen volledige paginascreenshot, dus geen 15 MB meer.
- Geen backend- of databasewijzigingen.

## Verwacht resultaat

- PDF bevat selecteerbare tekst plus de receptfoto.
- Bestandsgrootte normaal gesproken onder de 2 MB.
- Titel en bestandsnaam komen overeen met de echte receptnaam.
- Geen dubbele tekst.
- Werkt consistent op elke plek waar je het recept kunt downloaden.