# Firebase Multi-Site Hosting Setup

## Configuratie Overzicht

De Firebase hosting is geconfigureerd voor twee sites die beide vanuit de root directory worden beheerd:

- **Target "app"**: 
  - Site: fruitvriendjes-35c8c.web.app
  - Build folder: `dist/`
  - Source: Hoofdproject (Vite)

- **Target "handleiding"**: 
  - Site: schoolfruit-handleiding.web.app
  - Build folder: `handleiding/build/`
  - Source: Docusaurus documentatie

**Belangrijk:** Alle Firebase configuratie staat in de root directory. De handleiding heeft geen eigen .firebaserc of firebase.json meer.

## Deploy Targets (al ingesteld)

De targets zijn al geconfigureerd en opgeslagen in `.firebaserc`:
- `app` → fruitvriendjes-35c8c
- `handleiding` → schoolfruit-handleiding

Als je de targets opnieuw moet instellen, gebruik dan:

```bash
# Voor de hoofdapp (fruitvriendjes)
firebase target:apply hosting app fruitvriendjes-35c8c

# Voor de handleiding
firebase target:apply hosting handleiding schoolfruit-handleiding
```

## Deployen

### Beide sites tegelijk deployen:
```bash
firebase deploy --only hosting
```

### Alleen de hoofdapp deployen:
```bash
firebase deploy --only hosting:app
```

### Alleen de handleiding deployen:
```bash
# Eerst Docusaurus builden
cd handleiding
npm run build
cd ..

# Dan deployen
firebase deploy --only hosting:handleiding
```

## Build Commando's

### Hoofdapp builden:
```bash
npm run build
```

### Handleiding builden:
```bash
cd handleiding
npm run build
cd ..
```

## Troubleshooting

### "No hosting sites found"
Zorg dat beide hosting sites bestaan in je Firebase projecten:
- fruitvriendjes-35c8c project moet een hosting site hebben
- schoolfruit-handleiding project moet een hosting site hebben

### Target niet gevonden
Als je de error krijgt dat een target niet bestaat:
```bash
firebase target:clear hosting app
firebase target:clear hosting handleiding
```
En voer de target:apply commando's opnieuw uit.

### Build folders niet gevonden
Zorg dat je eerst de builds maakt voordat je deploy:
```bash
npm run build                    # Voor hoofdapp
cd handleiding && npm run build  # Voor handleiding
```
