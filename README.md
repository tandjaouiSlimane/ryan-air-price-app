# ✈ Ryanair Explorer

Interface web pour explorer les prix Ryanair par mois, avec proxy local Node.js.

## Prérequis

- **Node.js** (v14 ou supérieur) : https://nodejs.org
- Aucune dépendance npm à installer



## Structure

```
ryanair-explorer/
├── server.js         ← Proxy + serveur HTTP (Node.js pur, 0 dépendances)
├── public/
│   └── index.html    ← Interface web complète
└── README.md
```

## Fonctionnalités

1. **Sélection de l'aéroport de départ** — recherche parmi tous les aéroports Ryanair
2. **Liste des destinations** — toutes les destinations disponibles depuis l'aéroport avec un filtrage par mois
3. **Prix par mois** — prix minimum pour chaque mois de l'année
4. **Classement** — mois triés du moins cher au plus cher avec % d'économie
