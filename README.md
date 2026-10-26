# Quiz B3

Quiz sur React : client React (Vite) + API Node Express + base SQLite.

## Stack

| Partie | Techno |
| ------ | ------ |
| Client | React 19, Vite 8 |
| Serveur | Node.js, Express 5 |
| BDD | SQLite (`better-sqlite3`) |
| Outils | nodemon, concurrently, oxlint, dotenv |

## Prérequis

- Node 20.19+ ou 22.12+ (`node -v`)
- npm
- git

## Installation (après un clone)

```bash
git clone https://github.com/WilliamPeynichou/Quiz_B3_AACW.git
cd Quiz_B3_AACW
npm run install:all
npm run dev
```

- Client : http://localhost:5173
- API : http://localhost:3001

La base SQLite est créée et remplie automatiquement au premier démarrage du serveur.

## Scripts

| Commande (à la racine) | Rôle |
| ---------------------- | ---- |
| `npm run install:all` | installe les dépendances (racine, client, serveur) |
| `npm run dev` | lance le serveur et le client ensemble |
| `npm run dev --prefix server` | lance seulement l'API (avec nodemon) |
| `npm run dev --prefix client` | lance seulement le client |
| `npm run build --prefix client` | build de production du client |
| `npm run lint --prefix client` | lint du client (oxlint) |
| `npm run db:reset --prefix server` | supprime la BDD (recréée au prochain démarrage) |

## API

| Méthode | Route | Corps | Réponse |
| ------- | ----- | ----- | ------- |
| GET | `/api/questions` | – | `[{ id, question, options }]` (sans la bonne réponse) |
| POST | `/api/answer` | `{ id, choice }` | `{ correct, answer }` ou `404` |

La bonne réponse n'est jamais envoyée avant que le joueur ait répondu : la vérification se fait côté serveur.

## Base de données (SQLite)

- Fichier : `server/data/quiz.db` (non versionné, chacun a sa base locale).
- Table `questions` : `id`, `question`, `options` (tableau JSON), `answer` (index de la bonne option).
- Au démarrage : migration (`CREATE TABLE IF NOT EXISTS`) puis seed si la table est vide.
- Emplacement modifiable avec la variable `DB_PATH` dans `server/.env`.

### Ajouter des questions

1. Modifier `server/src/infrastructure/data/questions.js`.
2. Réinitialiser la base pour relancer le seed :

```bash
npm run db:reset --prefix server
npm run dev
```

## Architecture (clean architecture)

```
server/src/
├── domain/              règles métier pures (aucune dépendance)
│   ├── entities/        Question
│   ├── repositories/    contrats (interfaces)
│   └── errors/          erreurs métier
├── application/
│   ├── use-cases/       GetQuestions, CheckAnswer
│   └── dto/
├── infrastructure/
│   ├── data/            questions de départ (seed)
│   ├── database/        SQLite : connexion, migration, seed
│   ├── repositories/    SqliteQuestionRepository, InMemoryQuestionRepository
│   └── http/            app Express, routes, controllers, middlewares
├── config/              variables d'environnement
├── container.js         assemblage des dépendances
└── index.js             point d'entrée
server/tests/            unit / integration

client/src/
├── app/                 App racine
├── domain/models/
├── application/         hooks (useQuiz), services, context
├── infrastructure/api/  appels HTTP (httpClient, quizApi)
├── presentation/        pages, components, layouts
├── styles/  utils/  constants/  assets/
└── main.jsx
```

Règle : les dépendances pointent vers l'intérieur (presentation / infrastructure → application → domain).

En dev, Vite redirige `/api` vers `http://localhost:3001` (proxy dans `client/vite.config.js`). Pour une autre URL d'API, définir `VITE_API_URL`.

## Git

### Envoyer ses modifications

```bash
git status
git add .
git commit -m "Description des changements"
git pull --rebase origin main
git push origin main
```

### Récupérer les mises à jour des autres

```bash
git pull origin main
npm run install:all
```

### Travailler sur une branche

```bash
git checkout -b ma-branche
git add .
git commit -m "message"
git push -u origin ma-branche
```

Puis ouvrir une Pull Request sur GitHub vers `main`.

### Mettre sa branche à jour avec main

```bash
git checkout main
git pull origin main
git checkout ma-branche
git merge main
```

## Dépannage

- **`better-sqlite3` ne s'installe pas** : vérifier la version de Node (`node -v`), puis `rm -rf server/node_modules && npm install --prefix server`.
- **Le client affiche « Erreur : … »** : vérifier que le serveur tourne sur le port 3001.
- **Port déjà utilisé** : changer `PORT` dans `server/.env`, et mettre à jour le proxy dans `client/vite.config.js`.

## Variables d'environnement (serveur)

```bash
cp server/.env.example server/.env
```

| Variable | Défaut | Rôle |
| -------- | ------ | ---- |
| `PORT` | `3001` | port de l'API |
| `DB_PATH` | `data/quiz.db` | fichier SQLite (relatif au dossier `server/`) |

Le fichier `.env` est optionnel et n'est pas versionné.
