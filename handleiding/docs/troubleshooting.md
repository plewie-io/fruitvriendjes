---
sidebar_position: 5
---

# Troubleshooting

Oplossingen voor veelvoorkomende problemen met het Fruitvriendjes Admin Panel.

## Inlogproblemen

### ❌ "Access denied" Foutmelding

**Probleem:** Je krijgt een melding dat je geen toegang hebt.

**Oplossing:**

1. Controleer dat je email eindigt op:
   - handihow.com
   - eduprompt.nl
   - schoolfruit.nl
2. Log uit en probeer opnieuw in te loggen
3. Gebruik een ander account als je meerdere hebt

### ❌ Anonieme Account Geweigerd

**Probleem:** "Anonymous users are not allowed..."

**Oplossing:**

- Anonieme accounts worden niet toegestaan
- Log in met Google of email/wachtwoord
- Zorg dat je een bestaand account gebruikt

### ❌ Kan Niet Inloggen met Google

**Probleem:** Google login werkt niet.

**Oplossing:**

1. Wis je browser cache en cookies
2. Probeer een andere browser
3. Controleer of je het juiste Google account gebruikt
4. Disable ad blockers tijdelijk

## Data Weergave Problemen

### ⚠️ Data Laadt Niet

**Probleem:** Collecties blijven leeg of laden niet.

**Oplossing:**

1. Refresh de pagina (F5 of Ctrl+R)
2. Check je internetverbinding
3. Log uit en opnieuw in
4. Probeer een andere browser

### ⚠️ Afbeeldingen Tonen Niet

**Probleem:** Receptafbeeldingen worden niet weergegeven.

**Oplossing:**

1. Wacht even - afbeeldingen kunnen traag laden
2. Check je internetsnelheid
3. Refresh de pagina
4. Sommige recepten hebben mogelijk geen afbeelding

### ⚠️ Detail Weergave Opent Niet

**Probleem:** Klikken op een rij doet niets.

**Oplossing:**

1. Probeer opnieuw te klikken
2. Refresh de pagina
3. Gebruik een andere browser
4. Check of er JavaScript errors zijn (F12 > Console)

## Export Problemen

### 📥 Export Download Start Niet

**Probleem:** Export knop werkt niet.

**Oplossing:**

1. Check of pop-ups zijn toegestaan in je browser
2. Probeer een ander export formaat (CSV in plaats van JSON)
3. Filter de data om de dataset kleiner te maken
4. Gebruik een andere browser

### 📥 Export Bestand is Leeg

**Probleem:** Gedownload bestand heeft geen data.

**Oplossing:**

1. Controleer of er data in de collectie zit
2. Verwijder actieve filters
3. Probeer opnieuw te exporteren
4. Gebruik een ander export formaat

## Performance Problemen

### 🐌 Admin Panel Reageert Traag

**Probleem:** Alles gaat langzaam.

**Oplossing:**

1. Sluit andere browser tabs
2. Wis browser cache
3. Gebruik filters om datasets kleiner te maken
4. Sluit detail weergaves die je niet gebruikt
5. Refresh de pagina

### 🐌 Tabel Laadt Heel Langzaam

**Probleem:** Tabel met veel data laadt langzaam.

**Oplossing:**

1. Gebruik datumfilters om recente data te zien
2. Sorteer op een kolom om progressie te zien
3. Wacht geduldig - grote datasets duren langer
4. Overweeg data te exporteren voor offline analyse

## Browser Compatibiliteit

### ✅ Aanbevolen Browsers

- **Google Chrome** (laatste versie)
- **Microsoft Edge** (laatste versie)
- **Firefox** (laatste versie)
- **Safari** (laatste versie)

### ⚠️ Bekende Problemen

- **Oude browsers** - IE11 wordt niet ondersteund
- **Mobile browsers** - Admin panel is geoptimaliseerd voor desktop
- **Incognito mode** - Sommige features werken mogelijk niet

## Firebase/Firestore Problemen

### 🔒 "Permission Denied" Error

**Probleem:** Foutmelding over toegangsrechten.

**Oplossing:**

1. Log opnieuw in
2. Controleer je account email
3. Neem contact op met beheerder

### 🔒 App Check Errors

**Probleem:** Melding over App Check verificatie.

**Oplossing:**

1. Refresh de pagina
2. Wis cache en probeer opnieuw
3. Dit lost zich meestal vanzelf op
4. Neem contact op als het blijft

## Contact & Support

### 📧 Hulp Nodig?

Als je probleem hier niet wordt opgelost:

1. **Maak een screenshot** van het probleem
2. **Noteer foutmeldingen** uit de console (F12)
3. **Beschrijf de stappen** die tot het probleem leidden
4. **Neem contact op** met het ontwikkelteam

### 🐛 Bug Melden

Gevonden een bug?

1. Check of het een bekend probleem is
2. Probeer te reproduceren in een andere browser
3. Verzamel details (browser, OS, stappen)
4. Rapporteer aan het ontwikkelteam

## Debug Informatie Verzamelen

Als je technische hulp nodig hebt:

1. **Open Browser Console**
   - Windows/Linux: F12 of Ctrl+Shift+I
   - Mac: Cmd+Option+I

2. **Ga naar Console tab**
   - Rood gekleurde errors zijn belangrijk

3. **Maak Screenshot**
   - Van de error messages
   - Van wat je op het scherm ziet

4. **Check Network Tab**
   - Zie of requests falen
   - Rood = mislukte requests

Deze informatie helpt het ontwikkelteam om problemen sneller op te lossen.
