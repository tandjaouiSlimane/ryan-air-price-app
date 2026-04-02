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


## Fonctionnement de l'application

1. Sélectionnez votre **aéroport de départ**.
2. L'application affiche **toutes les destinations disponibles**, classées par prix afin d’identifier rapidement **la destination la moins chère**.
3. Possibilité de **filtrer les résultats par mois** pour cibler la période la plus économique.
4. En sélectionnant une destination, vous accédez à une page présentant **les prix minimums pour chaque mois**.
5. En choisissant un mois, un **calendrier interactif** affiche **les jours les moins chers pour l’aller et le retour**, facilitant le choix des dates optimales.