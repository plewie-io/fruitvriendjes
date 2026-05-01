## Doel
Voorkomen dat de browser oude versies van de site blijft tonen door bij het laden automatisch oude caches en eventueel geregistreerde service workers op te ruimen.

## Wijzigingen

### 1. `index.html` — cache-opruimscript in de `<head>`
Een klein inline-script toevoegen dat direct bij het laden van de pagina draait (vóór de React-app):

- **Service workers afmelden:** als `navigator.serviceWorker` bestaat, alle geregistreerde service workers ophalen en `unregister()` aanroepen. Dit project gebruikt geen service worker, maar als er ooit één is geregistreerd (bijv. via een eerdere preview of browserextensie) blijft die hardnekkig oude bestanden serveren.
- **Cache Storage legen:** als `window.caches` bestaat, alle cache-namen ophalen via `caches.keys()` en elk met `caches.delete()` verwijderen. Dit ruimt de Cache API op (gebruikt door PWA's/SW's).
- **Veilig uitvoeren:** alles in een `try/catch` zodat een fout het laden van de site niet blokkeert. Geen `await` op top-level (compatibiliteit), gewoon `.then()`.

Het script draait stil op de achtergrond; gebruikers merken er niets van. Het wijzigt **niet** de Vite-asset-cache (die is al hash-gebaseerd en correct).

### 2. `index.html` — extra cache-control meta-tag
Een `<meta http-equiv="Cache-Control" content="no-cache">` toevoegen als extra hint aan de browser om de HTML niet vast te houden. De server stuurt dit al in headers, maar de meta-tag helpt in randgevallen (bijv. wanneer de pagina via "back/forward cache" geladen wordt).

## Wat dit oplost
- Als ergens (preview, oude deploy, extensie) ooit een service worker is geregistreerd die nog oude `index.html` of assets serveert, wordt die nu bij het volgende bezoek opgeruimd.
- Oude Cache Storage entries worden geleegd, zodat de volgende keer alles vers van het netwerk komt.

## Wat dit niet oplost
- De allereerste keer dat een gebruiker met een vastzittende cache de site laadt, krijgt hij/zij nog steeds eenmalig de oude versie te zien. Het opruimen werkt pas vanaf de eerste keer dat het nieuwe `index.html` wél binnenkomt. Daarna is het probleem structureel weg.
- Disk cache van de browser zelf (niet via SW/Cache API) wordt niet aangeraakt — daar zorgen Vite's gehashte filenames al voor.

## Stappen na implementatie
1. Eénmalig publiceren zodat het script live komt.
2. Daarna zou het cacheprobleem bij volgende wijzigingen niet meer terug moeten komen.