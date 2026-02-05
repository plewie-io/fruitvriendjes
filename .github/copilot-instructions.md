# Fruitvriendjes Documentation Project Setup

## Project Type
Docusaurus documentation site for Fruitvriendjes admin handleiding

## ✅ Setup Complete

Alle stappen zijn voltooid:

- [x] Create copilot-instructions.md file
- [x] Clarify Project Requirements - Docusaurus documentation for Fruitvriendjes admin
- [x] Scaffold Docusaurus Project
- [x] Customize for Fruitvriendjes
- [x] Install Dependencies
- [x] Configure Firebase Hosting
- [x] Create Documentation Structure
- [x] Update README

## Project Details
- **Framework**: Docusaurus v3 (documentation generator)
- **Language**: Dutch (Nederlands)
- **Hosting**: Firebase (schoolfruit-handleiding site)
- **Purpose**: Admin handleiding for Fruitvriendjes app
- **Location**: `/handleiding/handleiding/`

## Documentation Pages Created
1. **intro.md** - Welkom en introductie
2. **inloggen.md** - Inloggen en toegangsbeheer
3. **data-collecties.md** - Overzicht van alle data collecties
4. **admin-panel-gebruiken.md** - Handleiding voor gebruik
5. **troubleshooting.md** - Probleemoplossing

## Next Steps

### Lokaal Testen
```bash
cd handleiding/handleiding
npm start
```

### Bouwen voor Productie
```bash
cd handleiding/handleiding
npm run build
```

### Deployen naar Firebase
```bash
cd handleiding/handleiding
firebase login
npm run build
firebase deploy --only hosting
```

## Firebase Configuration
- Project ID: `schoolfruit-handleiding`
- URL: https://schoolfruit-handleiding.web.app
- Build directory: `build/`

## Integration with Admin Panel

Om de handleiding te linken vanuit het FireCMS admin panel, voeg je een link toe in de AppBar:

```typescript
<AppBar 
  title="Fruitvriendjes Admin" 
  includeModeToggle={false}
  toolbarExtraWidget={
    <a href="https://schoolfruit-handleiding.web.app" target="_blank" rel="noopener noreferrer">
      Handleiding
    </a>
  }
/>
```
