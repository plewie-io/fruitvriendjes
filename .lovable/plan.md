# Plan: Pop-up scroll & sluitknop fix

## Probleem
De info-pop-ups (Leerkrachten / Ouders) in `src/pages/Index.tsx` gedragen zich niet goed:
- **Mobiel:** pop-up start bovenaan (niet gecentreerd), je kunt niet scrollen, en de sluitknop reageert niet.
- **PC:** scroll werkt soms wel, maar de sluitknop kan over de afbeelding overlappen.
- Mobiel en desktop hebben verschillende layout-quirks omdat de basis `DialogContent` uit `dialog.tsx` `grid` + `translate(-50%,-50%)` gebruikt, gecombineerd met `h-[100vh]` + safe-area padding wat de inhoud buiten beeld duwt.

## Oplossing in één keer (zelfde structuur op mobiel & PC)

In `src/pages/Index.tsx` beide `DialogContent`-blokken (Leerkrachten + Ouders) vervangen door dezelfde opzet:

1. **Container layout**
   - Mobiel: `fixed inset-0` (dus geen translate-centering meer die buiten beeld valt), volledige viewport, geen border/rounded.
   - Desktop (`sm:`): terug naar gecentreerde dialog (`sm:relative sm:inset-auto`, `sm:max-w-3xl`, `sm:h-[90vh]`, `sm:rounded-lg`).
   - `flex flex-col` i.p.v. `grid`, zodat de scroll-div correct `flex-1` kan vullen.
   - `p-0`, eigen close-knop (basis-knop verbergen met `[&>button]:hidden`).

2. **Sluitbalk bovenaan** (mobiel én desktop hetzelfde)
   - Een korte `header`-strook (`h-12 shrink-0`) met de X-knop rechts.
   - Op mobiel krijgt deze `padding-top: env(safe-area-inset-top)` zodat de knop onder de notch zit en nooit over de afbeelding valt.
   - Hierdoor overlapt de sluitknop nooit meer met de inhoud — op alle schermen.

3. **Scroll-container**
   - `flex-1 min-h-0 overflow-y-auto overscroll-contain` met `style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}`.
   - `min-h-0` is cruciaal in een flex-kolom om scrollen te laten werken.
   - `touch-action: pan-y` lost de iOS-bug op waarbij scrollen binnen Radix Dialog wordt geblokkeerd.

4. **Afbeelding**
   - `w-full h-auto block` blijft, zodat de afbeelding op volledige breedte weergeeft en verticaal kan scrollen.

5. **Safe-area** alleen toepassen op de header (top) en op de scroll-container bottom-padding, niet op de hele DialogContent — dat voorkomt de "halve padding"-issue.

## Resultaat
- Pop-up vult op mobiel netjes het scherm met sluitknop bovenaan onder de notch.
- Op desktop een gecentreerde pop-up met dezelfde header + scrollende afbeelding.
- Scrollen werkt op iOS Safari, Android Chrome en desktop browsers.
- Sluitknop overlapt nooit meer de inhoud, en is altijd bereikbaar.
- ESC-toets en klik-buiten-pop-up blijven werken (Radix-default).

## Bestanden
- `src/pages/Index.tsx` — beide `DialogContent`-blokken (regels ~284-330) vervangen door bovenstaande structuur.
