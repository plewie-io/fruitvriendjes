
## Kleur consistentie fix

### Probleem
De groene achtergrondkleur (CSS via HSL) en het golfje-beeld (PNG met exacte kleur) zijn net niet hetzelfde groen. Dit komt doordat de HSL-waarde `69 84% 39%` een lichte afronding heeft t.o.v. het exacte `#9BB510`.

### Oplossing
De HSL-waarde preciezer maken zodat deze exact overeenkomt met `#9BB510`.

### Technische details

**Bestand: `src/index.css`**
- `--brand-green` aanpassen van `69 84% 39%` naar `69.5 83.8% 38.6%` (exacte HSL van #9BB510)
- `--secondary` idem aanpassen
- Gradient variabelen (`--gradient-fresh`, `--gradient-hero`) ook updaten naar dezelfde waarden

Dit zorgt ervoor dat alle CSS-elementen met `bg-brand-green` exact dezelfde kleur tonen als het golfje-beeld.
