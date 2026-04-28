## Wat gaan we doen

1. **Twee groene balken oranje maken** (#F08400)
2. **"Download je recept als PDF" knop** onderaan de receptenkaart
3. **Feedback met duimpjes** (👍 groen / 👎 rood) opgeslagen in de backend, uitleesbaar in het admin paneel

---

## 1. Banners van groen naar oranje

In `src/pages/Index.tsx`:
- Bovenste banner (regel ~270): `backgroundColor: "#B3CA17"` → `"#F08400"`
- SVG-golf eronder (regel ~282): zelfde achtergrondkleur aanpassen
- Onderste "Inspiratie" banner (regel ~464): zelfde aanpassing
- Bovenliggende SVG-golf (regel ~447, fill `#B3CA17`): fill naar `#F08400`

De witte tekst en onderstreepte link blijven zichtbaar tegen oranje.

## 2. PDF-download knop

In `src/pages/Index.tsx`, in de receptkaart (regel ~414, na de `recipeImage` blok):
- Knop **"Download je recept als PDF"** onderaan toevoegen met `ChefHat`/`Download` icoon, oranje stijl passend bij de bestaande "Maak een recept!" knop
- Gebruikt `html2canvas` + `jspdf` (al eerder ingezet volgens project memory) om de complete receptkaart inclusief titel, tekst en afbeelding naar A4 PDF te renderen
- Bestandsnaam: `mandy-recept.pdf`

## 3. Feedback knoppen + opslag in backend

**UI** (in receptkaart, boven de PDF-knop):
- Tekst **"Wat vond je van dit recept?"**
- Daarnaast een **groene knop** met `ThumbsUp` icoon (kleur `#9BB510` / brand-green)
- Daarnaast een **rode knop** met `ThumbsDown` icoon (`bg-destructive` / rood)
- Na klikken: knop wordt actief gemarkeerd, andere uitgeschakeld, bedankje-toast tonen
- Per recept slechts 1x feedback; als de gebruiker een nieuw recept genereert, reset de feedbackstatus

**Backend (Firestore)**:
- In `src/lib/firebase.ts` een nieuwe functie `saveRecipeFeedback(recipeId, feedback: "up" | "down")` die:
  - het bestaande recept-document in de `recipes` collectie updatet met velden `feedback` (string: `"up"` / `"down"`) en `feedbackAt` (timestamp)
- Aanroepen vanuit `Index.tsx` met `currentRecipeId`

**Admin paneel** (`src/admin/collections/recipes.ts`):
- Twee nieuwe properties toevoegen aan de `Recipe` type en `properties`:
  - `feedback`: enum/select met `up` (👍 Positief) / `down` (👎 Negatief), readOnly
  - `feedbackAt`: date, readOnly
- Hierdoor zie je in het admin paneel per recept direct of de gebruiker positief/negatief reageerde

---

## Technische details

- Dependencies `html2canvas` en `jspdf` toevoegen indien nog niet aanwezig (`bun add html2canvas jspdf`)
- Receptkaart krijgt een `ref` zodat html2canvas precies dat element kan capturen
- Feedback-status (`"up" | "down" | null`) als lokale state in `Index.tsx`, gereset bij nieuw recept
- Geen RLS / Lovable Cloud nodig: de data leeft in Firestore en wordt automatisch zichtbaar in FireCMS

## Bestanden die wijzigen

- `src/pages/Index.tsx` — banners, PDF knop, feedback UI + state
- `src/lib/firebase.ts` — `saveRecipeFeedback` functie
- `src/admin/collections/recipes.ts` — feedback velden in admin
- `package.json` — `html2canvas`, `jspdf` (indien nodig)
