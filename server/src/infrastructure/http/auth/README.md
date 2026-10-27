# Authentification (features 1.1 à 1.4)

## Endpoints
- `POST /api/auth/register` : `{ username, email, password }` => `201 { token, user }`
- `POST /api/auth/login` : `{ email, password }` => `200 { token, user }`
- `GET /api/auth/me` : en-tête `Authorization: Bearer <token>` => `{ id, username }`

Mots de passe hashés via bcryptjs (12 rounds), JWT HS256, durée 24 h. Requêtes préparées SQLite.

## Configuration du secret local
Le fichier `server/.env` est suivi dans ce dépôt : **n'y mets jamais ton secret**.
Utilise plutôt `server/.env.auth.local` (ignoré par `*.local` du `.gitignore` racine) :

```text
JWT_SECRET=<secret aléatoire d'au moins 32 octets>
```

La commande d'installation fournie crée ce fichier si nécessaire.
Ne committe jamais de clé ni de mot de passe en clair.

## Tests

```powershell
npm run test:auth --prefix server
```

## Frontend
`AuthProvider` entoure les routes dans `App.jsx`, et `useAuth()` expose
`user`, `isAuthenticated`, `loading`, `login()` et `logout()`.
Le jeton est conservé en `sessionStorage` (jusqu'à fermeture de l'onglet), et
`httpClient` l'envoie automatiquement à l'API. L'écran `/login` permet
la connexion, l'inscription et la déconnexion.

**Travail en équipe** : seul `client/src/app/App.jsx` appartient au socle partagé.
Cette modification y ajoute exclusivement l'`AuthProvider`; faire valider
l'intégration aux collègues avant une PR vers `p-auth`.

**Pour une mise en production** : préférer des cookies HttpOnly Secure SameSite,
un anti-CSRF adapté et un rate-limit sur login/register. Le stockage JS
(sessionStorage) reste accessible en cas de XSS ; il est ici destiné au TP.
