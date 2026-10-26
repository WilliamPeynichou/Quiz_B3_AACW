# Features — Quiz B3

Site web de quiz : le joueur se connecte, choisit une catégorie et une difficulté, répond à des questions chronométrées, gagne des points selon la difficulté et apparaît dans un classement.

Le projet est découpé en **4 features développées en parallèle**, chacune divisée en **sous-features** numérotées (`X.Y`).

---

## Comment travailler en parallèle sans se marcher dessus

Trois règles :

1. **Un socle commun d'abord** (étape 0, sur `main`, ~1 h ensemble) : on y met tout ce que les 4 features partagent. Ensuite, **personne ne touche plus aux fichiers du socle**.
2. **Chaque feature possède ses fichiers.** On ne modifie que les fichiers de sa feature (voir « Fichiers possédés »).
3. **On code contre un contrat, pas contre le code des autres.** Tables et routes API sont figées dans le socle. Si on a besoin de quelque chose qui n'est pas encore fait, on utilise le **bouchon** (mock) prévu.

> Besoin de modifier un fichier qui n'est pas à toi ou un contrat ? On en parle à l'équipe, puis petite PR directe sur `main` que tout le monde récupère.

---

## Étape 0 — Socle commun (avant de se séparer)

| # | Élément | Contenu |
|---|---------|---------|
| 0.1 | Schéma BDD complet | `migrate.js` crée **toutes** les tables d'un coup (voir Contrats) |
| 0.2 | Seeds séparés | `seed.js` appelle `seeds/catalog.js` et `seeds/ranking.js` (fichiers vides au départ) |
| 0.3 | Branchement serveur | `container.js` et `app.js` montent déjà les 4 routeurs : `/api/auth`, `/api/catalog`, `/api/game`, `/api/ranking` (routeurs vides) |
| 0.4 | Branchement client | `react-router` installé, `App.jsx` déclare déjà les routes vers 4 pages vides |
| 0.5 | Constantes partagées | `DIFFICULTIES = ['facile', 'moyen', 'difficile']` côté serveur et client |
| 0.6 | Bouchon d'auth | `middlewares/requireAuth.js` qui met `req.user = { id: 1, username: 'demo' }` |

---

## Contrats (figés dans le socle)

### Tables

```sql
users      (id, username UNIQUE, email UNIQUE, password_hash, created_at)
categories (id, name)
questions  (id, question, options, answer, category_id, difficulty)
results    (id, user_id, category_id, difficulty, score, correct_count, total, duration_ms, played_at)
```

### API

| Feature | Route | Réponse |
|---------|-------|---------|
| auth | `POST /api/auth/register` `{ username, email, password }` | `{ token, user }` |
| auth | `POST /api/auth/login` `{ email, password }` | `{ token, user }` |
| auth | `GET /api/auth/me` | `{ id, username }` |
| catalog | `GET /api/catalog/categories` | `[{ id, name }]` |
| catalog | `GET /api/catalog/questions?category=&difficulty=` | `[{ id, question, options }]` |
| game | `POST /api/game/answer` `{ id, choice }` | `{ correct, answer }` |
| game | `POST /api/game/results` `{ categoryId, difficulty, answers[] }` | `{ score, correct_count, total }` |
| ranking | `GET /api/ranking?category=&difficulty=` | `[{ rank, username, score }]` |
| ranking | `GET /api/ranking/me` | `[{ category, difficulty, score, played_at }]` |

Utilisateur connecté : toujours lu via `req.user` côté serveur, via `useAuth()` côté client.
Lien entre écrans : le choix mène à `/play?category=<id>&difficulty=<niveau>`.

---

## Feature 1 — Authentification (`auth`)

| # | Sous-feature | Description |
|---|--------------|-------------|
| 1.1 | Inscription | `POST /api/auth/register`, mot de passe hashé (bcrypt) |
| 1.2 | Connexion | `POST /api/auth/login` → token JWT, `GET /api/auth/me` |
| 1.3 | Vrai `requireAuth` | Remplace le bouchon : vérifie le JWT et remplit `req.user` |
| 1.4 | Côté client | Pages login / inscription, `AuthContext` + `useAuth()`, ajout du token dans `httpClient` |

**Fichiers possédés** : `server/**/auth/`, `requireAuth.js`, `client/**/auth/`, `httpClient.js`
**Dépend de personne** : la feature est autonome.

## Feature 2 — Catégories & difficultés (`catalog`)

| # | Sous-feature | Description |
|---|--------------|-------------|
| 2.1 | Seed | `seeds/catalog.js` : catégories + questions pour chaque difficulté |
| 2.2 | API catégories | `GET /api/catalog/categories` |
| 2.3 | API questions filtrées | `GET /api/catalog/questions?category=&difficulty=` (ordre aléatoire, sans la réponse) |
| 2.4 | Écran de choix | Page : choix de la catégorie puis de la difficulté → redirige vers `/play?...` |

**Fichiers possédés** : `server/**/catalog/`, `seeds/catalog.js`, `client/**/catalog/`
**Dépend de personne** : la feature est autonome.

## Feature 3 — Partie, temps & points (`game`)

| # | Sous-feature | Description |
|---|--------------|-------------|
| 3.1 | Chrono par question | 20 s facile, 15 s moyen, 10 s difficile. Temps écoulé = réponse fausse |
| 3.2 | Calcul des points | Côté serveur : facile ×1, moyen ×2, difficile ×3 (+ bonus de rapidité optionnel) |
| 3.3 | Enregistrement | `POST /api/game/answer` et `POST /api/game/results` → insertion dans `results` avec `req.user.id` |
| 3.4 | Écran de fin | Score, bonnes réponses, temps total |

**Fichiers possédés** : `server/**/game/`, `client/**/game/` (page `/play`, `useQuiz`)
**Bouchons utilisés** : `req.user` = utilisateur démo (auth). Pour les questions, on lit la table `questions` en direct sans attendre la route de catalog. Pour la page, on teste avec une URL tapée à la main (`/play?category=1&difficulty=facile`).

## Feature 4 — Classement & historique (`ranking`)

| # | Sous-feature | Description |
|---|--------------|-------------|
| 4.1 | Faux résultats | `seeds/ranking.js` : quelques users et results fictifs pour développer sans attendre `game` |
| 4.2 | API classement | `GET /api/ranking?category=&difficulty=` → top 10 |
| 4.3 | Page classement | Tableau avec filtres catégorie / difficulté, position du joueur surlignée |
| 4.4 | Historique | `GET /api/ranking/me` + page « Mes parties » |

**Fichiers possédés** : `server/**/ranking/`, `seeds/ranking.js`, `client/**/ranking/`
**Bouchons utilisés** : faux résultats (4.1) et utilisateur démo (auth).

---

## Intégration

Quand une feature est terminée, on fait une PR `p-<feature>` → `main`. Ordre de merge conseillé (sans être obligatoire) : `catalog` → `auth` → `game` → `ranking`.
Après le merge de `auth`, le bouchon `requireAuth` disparaît tout seul (même fichier). Rien à changer dans les autres features.
On retire le seed de faux résultats de `ranking` une fois `game` mergé.

---

## Convention Git

### Les branches

```
main                                      ← socle + features terminées, jamais de commit direct
 └── p-<feature>                          ← p-branch : branche parent d'une feature
      └── Prenom_Nom_<feature>_<version>  ← branche de travail d'une sous-feature
```

| Feature | p-branch |
|---------|----------|
| 1 — Authentification | `p-auth` |
| 2 — Catégories & difficultés | `p-catalog` |
| 3 — Partie, temps & points | `p-game` |
| 4 — Classement & historique | `p-ranking` |

Les 4 p-branches partent de `main` **après** le merge du socle.

### Nommage des branches de travail

Format : **`Prenom_Nom_feature_version`** (version = numéro de la sous-feature)

```
William_Peynichou_auth_1.2
William_Peynichou_game_3.1
William_Peynichou_ranking_4.2
```

### Le cycle

```bash
git checkout p-auth
git pull origin p-auth
git checkout -b William_Peynichou_auth_1.2
git add .
git commit -m "auth 1.2 : connexion JWT"
git push -u origin William_Peynichou_auth_1.2
```

- PR **branche de travail → p-branch** (`William_Peynichou_auth_1.2` → `p-auth`)
- Feature terminée : PR **p-branch → main** (`p-auth` → `main`)

### Messages de commit

Format : **`<feature> <version> : <ce qui a été fait>`**

```
auth 1.2 : connexion JWT
game 3.1 : chrono par question
fix catalog 2.3 : filtre difficulté ignoré
```

### Règles simples

- Jamais de commit direct sur `main` (sauf le socle et les petites PR de contrat).
- Une branche = une sous-feature.
- On ne modifie que les fichiers de sa feature.
- Après une PR de contrat sur `main`, chaque p-branch la récupère : `git merge main`.
- On supprime sa branche de travail une fois mergée.
