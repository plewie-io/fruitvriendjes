## Doel
Twee knoppen toevoegen aan de linkerkant van het scherm in schoolfruit-groen. Elke knop opent een popup met een afbeelding uit de meegestuurde PDF (`Praktische_tip_mandy.pdf`).

- **Knop 1:** "Info voor leerkrachten" → popup met afbeelding van pagina 1
- **Knop 2:** "Info voor ouders" → popup met afbeelding van pagina 2 (uitleg Mandy Mandarijn)

## Stappen

1. **PDF-pagina's omzetten naar afbeeldingen**
   - Pagina 1 en 2 van de PDF renderen als hoge-resolutie PNG's (`pdftoppm`).
   - Opslaan in `src/assets/`:
     - `src/assets/info-leerkrachten.png`
     - `src/assets/info-ouders.png`

2. **Vaste zijbalk met knoppen toevoegen** (in `src/pages/Index.tsx`)
   - Een `fixed left-4 top-1/2 -translate-y-1/2` container met twee knoppen onder elkaar.
   - Achtergrondkleur: schoolfruit-groen (`#9BB510` met hover `#B3CA17`).
   - Witte tekst, `font-poster uppercase`, afgeronde hoeken, schaduw.
   - Op mobiel: `bottom-4` horizontaal naast elkaar (zodat ze niet over de content vallen op kleine schermen).

3. **Popups (Dialog component)**
   - Twee `Dialog` componenten gebruiken uit `@/components/ui/dialog`.
   - State: `openLeerkrachten` en `openOuders`.
   - Dialog-content: alleen de afbeelding, schermvullend op mobiel, `max-w-3xl` op desktop, met sluitknop (al ingebouwd).
   - Klik op de knop → opent bijbehorende dialog.

## Technische details

- **Bestanden te bewerken:** `src/pages/Index.tsx`
- **Nieuwe assets:** `src/assets/info-leerkrachten.png`, `src/assets/info-ouders.png`
- **Component:** `Dialog` (al aanwezig in `src/components/ui/dialog.tsx`)
- **Kleuren:** schoolfruit-groen `#9BB510` / hover `#B3CA17` (uit Core memory)
- **Positionering:** `fixed` zodat knoppen meescrollen; `z-40` zodat ze boven content maar onder dialogs blijven.

```text
┌──────────────────────────────┐
│  Header                      │
├────┬─────────────────────────┤
│ 📘 │                         │
│Lkr │   Hoofd content         │
├────┤   (Mandy Mandarijn)     │
│ 👨‍👩 │                         │
│Oud │                         │
└────┴─────────────────────────┘
```
