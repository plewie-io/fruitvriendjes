---
sidebar_position: 3
---

# Data Collecties

Het admin panel bevat drie hoofdcollecties met data uit de Fruitvriendjes app.

## Overzicht van Collecties

### 📋 Sessies

**Recepten chat sessies** - Elke sessie is een recepten chat waar gebruikers recepten genereren.

**Wat zie je:**

- Gebruikers-ID (verborgen in tabelweergave)
- Fruitpersonage (Mandy Mandarijn of Annie Ananas)
- Aangemaakt op
- Bijgewerkt op

**Gebruik:**

- Bekijk hoeveel recepten chat sessies er zijn
- Zie welk fruitpersonage het meest populair is
- Track wanneer sessies zijn aangemaakt

### 🍳 Recepten

**Recepten gegenereerd door AI** tijdens een recepten chat sessie.

**Wat zie je:**

- Sessie (link naar de recepten chat sessie)
- Ingrediënten
- Recept (met markdown formatting)
- Afbeelding (gegenereerde afbeelding van het recept)
- Is aanpassing (of het een aangepast recept is)
- Aangemaakt op

**Verborgen velden:**

- Gebruikers-ID
- Afbeelding prompt
- Vorige recept-ID

**Gebruik:**

- Bekijk welke recepten zijn gegenereerd
- Zie de meest gebruikte ingrediënten
- Controleer de kwaliteit van gegenereerde recepten

### 💬 Chatsessies

**Chats met de chatbot** onderin de pagina.

**Wat zie je:**

- Sessie (link naar de hoofdsessie)
- Berichten (array van chatberichten)
  - Rol (Gebruiker of Model)
  - Inhoud
  - Tijdstempel
- Aangemaakt op
- Bijgewerkt op

**Verborgen velden:**

- Gebruikers-ID

**Gebruik:**

- Bekijk gesprekken met de chatbot
- Monitor kwaliteit van AI responses
- Zie welke vragen gebruikers stellen

## Collectie Beheer

### Lezen

Alle collecties zijn **read-only** - je kunt data bekijken maar niet bewerken of verwijderen.

### Filters en Zoeken

- Gebruik de zoekbalk om specifieke records te vinden
- Klik op kolomkoppen om te sorteren
- Gebruik filters om data te filteren

### Data Exporteren

Je kunt data exporteren naar CSV:

1. Open een collectie
2. Klik op het export icoon (rechtsboven)
3. Kies je export formaat
4. Download het bestand

## Relaties tussen Collecties

```
Sessies (Recepten chat)
    ├── Recepten (gegenereerd tijdens deze sessie)
    └── Chatsessies (chatbot conversaties)
```

Elk recept en elke chatsessie is gekoppeld aan een hoofdsessie via het `sessionId` veld.
