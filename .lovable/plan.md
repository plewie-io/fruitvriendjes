## Doel

Tijdens het genereren van een recept én de bijbehorende foto verschijnt er een vrolijke wacht-popup met een geanimeerde zandloper in wortelvorm (zoals de geüploade afbeelding). Dit verbetert de klantbeleving zodat de gebruiker ziet dat er iets gebeurt en niet ongeduldig wordt.

## Wat de gebruiker ziet

- Zodra je op "Maak een recept!" of "Pas recept aan!" klikt, opent een centrale popup (overlay) die niet weg te klikken is.
- In de popup staat:
  - Een geanimeerde wortel-zandloper (3 standen: leeg bovenin → zand stroomt → vol onderin), die continu loopt.
  - Een vrolijke titel die meeloopt met de fase:
    - Fase 1 ("Recept maken..."): "Mandy bedenkt een lekker recept..."
    - Fase 2 ("Foto maken..."): "Mandy tekent nu een mooie foto..."
  - Een korte ondertekst met een wisselend leuk weetje/fruittip (elke ~4s een ander zinnetje) zodat het wachten leuker voelt.
- Popup sluit automatisch zodra zowel recept als foto klaar zijn (of bij een fout).

## Visueel ontwerp van de zandloper

Geïnspireerd op de geüploade afbeelding: oranje wortel met groen loof bovenaan, en in het lichaam een zandloper-vorm. We bouwen dit met **pure SVG + CSS animaties** (geen extra dependencies, geen externe afbeelding nodig). 

- Wortel: oranje (`#F08400`) met groen loof (`#9BB510`).
- Zandloper-uitsparing: wit/transparant binnen de wortel.
- Zand: oranje gestippeld (`#DB7202`).
- Animatie (loop, ~3s):
  1. Zand vol bovenin
  2. Zand stroomt door de smalle hals (dunne lijn van stippen)
  3. Zand vol onderin
  4. Wortel "kantelt" 180° met een zachte tween en herstart
- Subtiele bobbel/wiebel animatie op het loof voor speelsheid.

## Bestanden die we toevoegen/aanpassen

**Nieuw bestand: `src/components/CarrotHourglassLoader.tsx`**
- Bevat de SVG-wortel met de zandloper-animatie (CSS keyframes inline of via Tailwind `@keyframes` in `index.css`).
- Props: `size?: number` zodat het herbruikbaar is.

**Nieuw bestand: `src/components/RecipeLoadingDialog.tsx`**
- Een `<Dialog>` (van shadcn) of een eigen overlay (`fixed inset-0 bg-black/50 z-50 flex items-center justify-center`) met daarin:
  - De `CarrotHourglassLoader`
  - Titel die afhangt van `phase: "recipe" | "image"`
  - Roterende leuke weetjes (array van ~5 zinnen, om de 4 sec wisselen via `setInterval`).
- Props: `open: boolean`, `phase: "recipe" | "image"`.
- Niet sluitbaar door erbuiten te klikken of Esc (forceer `onOpenChange` no-op tijdens loading).

**Aanpassing: `src/pages/Index.tsx`**
- Importeer `RecipeLoadingDialog`.
- Render `<RecipeLoadingDialog open={loading || imageLoading} phase={imageLoading ? "image" : "recipe"} />` ergens bovenin de return (na de bestaande safety dialog).
- Houd de bestaande knop-loader (spinner in de knop) intact als secundaire indicatie — of verwijder deze; we kiezen om de spinner-tekst in de knop te behouden zodat er geen layout shift is, maar de popup is de hoofdindicator.

**Aanpassing: `src/pages/RecipeGenerator.tsx`**
- Hetzelfde: importeer en render `RecipeLoadingDialog` met `open={loading || imageLoading}` en juiste `phase`.

## Technische details

- **Geen nieuwe dependencies** nodig. SVG + Tailwind/CSS keyframes volstaan.
- Animaties via `@keyframes` in `src/index.css` (bv. `carrot-flip`, `sand-fall`) of inline `<style>` in de component.
- Toegankelijkheid: `role="dialog"`, `aria-live="polite"` met de huidige fase-tekst zodat screenreaders meegaan.
- Body scroll lock tijdens open (gebruikt shadcn Dialog standaard al).
- Z-index hoger dan andere content, lager dan toasts.
- Geen wijzigingen aan de Firebase-calls of generatielogica zelf — alleen UI-laag.

## Edge cases

- Als generatie faalt: `loading`/`imageLoading` worden `false` in `finally`, dus popup sluit automatisch en de bestaande error-toast verschijnt.
- Bij "modify recipe" (recept aanpassen) gebruikt dezelfde popup, met `phase="recipe"` en daarna `phase="image"` als er ook een nieuwe foto wordt gemaakt.
- De huidige toasts ("Recept klaar! 🎉", "Nu maken we een foto...") blijven bestaan; ze geven context naast de popup.

## Resultaat

De gebruiker krijgt direct visuele feedback met een speelse, on-brand wacht-animatie die past bij Mandy Mandarijn en Schoolfruit. Wachten voelt korter en leuker.
