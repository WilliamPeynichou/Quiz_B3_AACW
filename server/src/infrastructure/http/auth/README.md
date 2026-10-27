# Authentification — feature 1.1

Première livraison : inscription (`POST /api/auth/register`).

- Valide `username` (3–30 caractères), `email` et `password` (8 caractères min., 72 octets max.).
- Normalise le nom d'utilisateur et l'email en minuscules.
- Refuse les doublons avec le statut HTTP `409`.
- Stocke uniquement `password_hash`, calculé avec bcryptjs (coût 12).
- Renvoie `201` et le contrat `{ token, user }` du socle. Le JWT HS256 expire après 24 h.

## Configuration locale

Définir une variable `JWT_SECRET` de 32 octets minimum avant de lancer l'API.
Ne jamais versionner un secret dans Git.

Exemple PowerShell pour une session de développement :

```powershell
$env:JWT_SECRET = node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
npm install --prefix server
npm run dev
```

Test manuel dans un autre PowerShell :

```powershell
$body = @{ username = 'cedric'; email = 'cedric@example.com'; password = 'mot-de-passe-test-123' } | ConvertTo-Json
Invoke-RestMethod http://localhost:3001/api/auth/register -Method Post -ContentType 'application/json' -Body $body
```

Tests unitaires (pas besoin de base SQLite) :
`npm run test:auth --prefix server`

## Prochaines sous-features

- 1.2 : connexion et récupération du compte courant
- 1.3 : vérification des JWT dans requireAuth
- 1.4 : écrans React et AuthContext

Aucun fichier des fonctionnalités catalog, game ou ranking n'a été modifié.
