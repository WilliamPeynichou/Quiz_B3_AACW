# Quiz B3

Quiz React (client Vite) + API Node Express (server).

```
client/   front React
server/   API Express (port 3001)
```

## Installation (après un clone)

```bash
git clone <url-du-repo>
cd Quiz_B3_AACW
npm run install:all
npm run dev
```

Client : http://localhost:5173 — API : http://localhost:3001

## Lancer séparément

```bash
npm run dev --prefix server
npm run dev --prefix client
```

## Mettre à jour le repo (push)

```bash
git status
git add .
git commit -m "Description des changements"
git pull --rebase origin main
git push origin main
```

## Récupérer les mises à jour des autres

```bash
git pull origin main
npm run install:all
```

## Travailler sur une branche

```bash
git checkout -b ma-branche
git add .
git commit -m "message"
git push -u origin ma-branche
```

## Prérequis

Node 20.19+ ou 22.12+ (`node -v`).
