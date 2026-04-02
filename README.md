# ✈ Ryanair Explorer

Interface web pour explorer les prix Ryanair par mois, avec proxy local Node.js.

## Prérequis

- **Node.js** (v14 ou supérieur) : https://nodejs.org
- Aucune dépendance npm à installer

## Lancer l'application

### Mac / Linux
```bash
bash start.sh
```

### Windows
Double-cliquez sur `start.bat`

### Manuel
```bash
node server.js
```

Puis ouvrez http://localhost:3000 dans votre navigateur.

## Fonctionnement

```
Votre navigateur
      ↓
http://localhost:3000  ← serveur Node.js (server.js)
      ↓
https://www.ryanair.com/api  ← API Ryanair (via proxy)
```

Le proxy Node.js contourne les restrictions CORS en servant de relai entre
votre navigateur et l'API Ryanair, en ajoutant les headers nécessaires.

## Structure

```
ryanair-explorer/
├── server.js         ← Proxy + serveur HTTP (Node.js pur, 0 dépendances)
├── public/
│   └── index.html    ← Interface web complète
├── start.sh          ← Lanceur Mac/Linux
├── start.bat         ← Lanceur Windows
└── README.md
```

## Fonctionnalités

1. **Sélection de l'aéroport de départ** — recherche parmi tous les aéroports Ryanair
2. **Choix de l'année** — année en cours + 2 ans à venir
3. **Liste des destinations** — toutes les destinations disponibles depuis l'aéroport
4. **Prix par mois** — prix minimum pour chaque mois de l'année
5. **Classement** — mois triés du moins cher au plus cher avec % d'économie
