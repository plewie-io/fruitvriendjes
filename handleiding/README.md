# Fruitvriendjes Handleiding

Documentatie site voor het Fruitvriendjes Admin Panel, gebouwd met Docusaurus.

## 🚀 Over Dit Project

Deze handleiding helpt beheerders van Schoolfruit.nl om het Fruitvriendjes Admin Panel te gebruiken. De documentatie bevat:

- Inloggen en toegangsbeheer
- Data collecties overzicht
- Admin panel gebruiksinstructies
- Troubleshooting en veelgestelde vragen

## 📦 Installatie

```bash
npm install
```

## 🔧 Lokale Development

Start de development server:

```bash
npm start
```

De site opent op `http://localhost:3000/`

## 🏗️ Bouwen voor Productie

Bouw de statische site:

```bash
npm run build
```

De site wordt gebouwd naar de `build/` directory.

## 🚀 Deployment naar Firebase

Deze site wordt gehost op Firebase Hosting (schoolfruit-handleiding).

### Eerste Keer Deployment

1. **Login bij Firebase:**

   ```bash
   firebase login
   ```

2. **Initialiseer Firebase (indien nodig):**
   ```bash
   firebase init hosting
   ```

   - Selecteer de `schoolfruit-handleiding` project
   - Gebruik `build` als public directory
   - Configureer als single-page app: Yes
   - Overschrijf index.html: No

### Deployment Stappen

1. **Bouw de site:**

   ```bash
   npm run build
   ```

2. **Deploy naar Firebase:**
   ```bash
   firebase deploy --only hosting
   ```

De site is dan live op: `https://schoolfruit-handleiding.web.app`

## 📁 Folder Structuur

```
handleiding/
├── docs/               # Documentatie markdown bestanden
│   ├── intro.md       # Introductie
│   ├── inloggen.md    # Inlog instructies
│   ├── data-collecties.md
│   ├── admin-panel-gebruiken.md
│   └── troubleshooting.md
├── src/               # React componenten en CSS
│   ├── css/           # Custom styling
│   └── pages/         # Custom pagina's
├── static/            # Statische assets (afbeeldingen, etc.)
├── docusaurus.config.ts  # Docusaurus configuratie
├── sidebars.ts        # Sidebar navigatie configuratie
└── firebase.json      # Firebase hosting configuratie
```

## ✏️ Documentatie Bewerken

Alle documentatie staat in `docs/` als Markdown bestanden:

1. Bewerk een `.md` bestand in `docs/`
2. Save het bestand
3. De wijziging is direct zichtbaar in development mode
4. Build en deploy om live te gaan

### Markdown Features

Docusaurus ondersteunt:

- **Frontmatter** - Metadata bovenaan elk bestand
- **Admonitions** - :::tip, :::warning, :::danger blocks
- **Code blocks** - Met syntax highlighting
- **Markdown links** - Tussen documenten
- **Afbeeldingen** - Uit `/static` directory

## 🎨 Styling Aanpassen

Custom CSS staat in `src/css/custom.css`.

## 🔗 Links

- **Live Site:** https://schoolfruit-handleiding.web.app
- **Admin Panel:** https://fruitvriendjes.nl/admin
- **Fruitvriendjes App:** https://fruitvriendjes.nl
- **Docusaurus Docs:** https://docusaurus.io/

## 📝 Licentie

Copyright © 2026 Schoolfruit.nl
