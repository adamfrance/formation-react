# API de la formation React

La seule API du cours. Elle reproduit en local l'API publique [DummyJSON](https://dummyjson.com) : mêmes chemins, mêmes
réponses, mêmes règles (pagination, recherche, limite de débit, jetons de connexion). Trombi et la Marketplace l'appellent
sur `http://localhost:4000` au lieu de `https://dummyjson.com`. On la lance au début de la journée, dans un terminal à
part, et on n'y touche plus.

## Lancer

```bash
cd ~/projets/formation-react/api
npm install
npm start
```

```text
API de la formation sur http://localhost:4000 (development)
```

Node.js 22 ou plus récent. `Ctrl+C` l'arrête proprement. Si le port 4000 est pris : `PORT=4001 npm start`.

## Comptes de démonstration

Les mêmes que DummyJSON : identifiant et mot de passe `<identifiant>pass`.

| Identifiant | Mot de passe | Rôle |
|---|---|---|
| `emilys` | `emilyspass` | admin |
| `michaelw` | `michaelwpass` | admin |
| `oliviaw` | `oliviawpass` | moderator |
| `averyp` | `averyppass` | user |

Les mots de passe ne sont pas dans les données : seules leurs empreintes bcrypt y sont, et aucune réponse ne les renvoie.

## Adresses

| Requête | Réponse |
|---|---|
| `GET /users`, `/products`, `/todos`, `/posts`, `/carts`, `/comments` | `{ users: [...], total, skip, limit }`, avec `limit` (0 = tout, 30 par défaut), `skip`, `select=a,b`, `sortBy`, `order=asc\|desc` |
| `GET /<ressource>/:id` | un élément (`select` possible) ; 404 s'il n'existe pas |
| `GET /users/search?q=`, `/products/search?q=`, `/posts/search?q=` | recherche sans tenir compte de la casse |
| `GET /users/filter?key=hair.color&value=Brown` | filtre exact sur un champ, même imbriqué |
| `GET /users/:id/todos`, `/users/:id/posts`, `/users/:id/carts` | les éléments d'un utilisateur (aussi `/todos/user/:id`, `/posts/user/:id`, `/carts/user/:id`) |
| `GET /posts/:id/comments`, `/comments/post/:id` | les commentaires d'une publication |
| `GET /products/categories`, `/products/category-list`, `/products/category/:slug` | les catégories de produits |
| `POST /<ressource>/add`, `PUT` ou `PATCH /<ressource>/:id`, `DELETE /<ressource>/:id` | écriture **simulée** : la réponse montre le résultat, rien n'est enregistré |
| `POST /carts/add` (`{ userId, products: [{ id, quantity }] }`) | une commande, totaux calculés depuis le catalogue |
| `POST /auth/login` (`{ username, password, expiresInMins }`) | `{ accessToken, refreshToken, id, username, … }` et deux cookies `HttpOnly` |
| `GET /auth/me` (`Authorization: Bearer <jeton>` ou cookie) | le profil de l'utilisateur connecté |
| `POST /auth/refresh` (`{ refreshToken }` ou cookie) | un nouveau couple de jetons |
| `GET /auth/<ressource>…` | les mêmes ressources, jeton exigé |
| `GET /icon/:nom/:taille` | un avatar (PNG enregistré, sinon SVG généré) |
| `?delay=1500` sur toute requête | la réponse attend 1,5 s (5 s au plus), pour voir les chargements |
| `GET /test` | `{ status: 'ok', method: 'GET' }` |

Les erreurs sont toujours en JSON : `{ "message": "User with id '999' not found" }`.

## Sécurité

- **Limite de débit** de DummyJSON : 100 requêtes par tranche de 10 secondes et par adresse IP, avatars compris, puis
  `429` ; en-têtes `x-ratelimit-limit`, `x-ratelimit-remaining`, `x-ratelimit-reset`. Les images des produits, servies
  comme par un CDN, n'y entrent pas.
- **CORS** limité aux applications du cours (`CORS_ORIGINS`), cookies autorisés.
- **En-têtes de sécurité** (`helmet`) ; l'en-tête `X-Powered-By` est retiré.
- **Entrées contrôlées** (`zod`) ; corps JSON limité à 100 ko (`413` au-delà) ; clés dangereuses (`__proto__`) ignorées.
- **Mots de passe** vérifiés avec bcrypt ; même réponse, en temps comparable, pour un compte inconnu et un mauvais mot de
  passe.
- **Jetons JWT** signés avec `JWT_SECRET` et `JWT_REFRESH_SECRET`, lus dans l'environnement : aucun secret dans un
  fichier. Sans eux, en développement, l'API tire des secrets au hasard à chaque démarrage (les jetons ne survivent pas à
  un redémarrage) ; en production, elle refuse de démarrer.
- **Erreurs** centralisées, sans pile d'appels hors développement ; arrêt propre sur `SIGINT` et `SIGTERM`.

## Configuration

Copier `.env.example` en `.env` pour changer une valeur (`.env` n'est jamais committé) : `JWT_SECRET`,
`JWT_REFRESH_SECRET`, `PORT` (4000), `PUBLIC_URL` (adresse des images), `CORS_ORIGINS`, `RATE_LIMIT_MAX` (100),
`RATE_LIMIT_WINDOW_MS` (10000), `HOST` (127.0.0.1 : l'API n'est pas visible depuis le réseau), `NODE_ENV`.

## Organisation du code

```text
src/
├── server.js         démarre l'API, l'arrête proprement
├── app.js            construit l'application Express (les tests l'importent sans ouvrir de port)
├── config.js         seul fichier qui lit les variables d'environnement
├── routes/           les adresses, dans l'ordre (chemins fixes avant /:id)
├── controllers/      lire la requête, appeler un service, répondre
├── services/         les règles : listes (pagination, tri, recherche), écritures simulées, paniers, jetons
├── repositories/     les données de data/, chargées une fois et gelées
├── middlewares/      authentification, validation, délai, limite de débit, journal, erreurs
├── schemas/          les contrôles d'entrée (zod), avec les messages de DummyJSON
└── utils/            petits outils (erreur HTTP, cookies, icône SVG)
data/                 les données de DummyJSON (importées par scripts/importer-dummyjson.js)
public/               avatars et miniatures des produits
test/                 les tests (Vitest et supertest)
```

## Tests

```bash
npm test
```

151 tests : 114 requêtes comparées aux réponses de DummyJSON enregistrées (`test/fixtures/dummyjson.json` :
même statut, mêmes champs, dans le même ordre), connexion et jetons, sécurité, écritures simulées, délai, avatars.

## Différences avec DummyJSON

- Aucun mot de passe dans les réponses (DummyJSON renvoie le champ `password` des utilisateurs).
- Un jeton mal formé donne `401 Invalid/Expired Token!` (DummyJSON répond `500 invalid token`) ; une durée de validité
  invalide donne `400` (DummyJSON : `500`).
- Une route inconnue donne `404` en JSON (DummyJSON renvoie une page HTML).
- Le cookie `refreshToken` vit 30 jours, comme le jeton qu'il contient (DummyJSON lui donne la durée du jeton d'accès).
- Les galeries de photos des produits (`images`, 474 photos, 27 Mo) restent sur le CDN de DummyJSON : seules les
  miniatures (`thumbnail`) et les avatars sont servis en local. Sans Internet, la fiche d'un produit n'a pas sa galerie.
- `PUT /carts/:id` avec `merge` : totaux recalculés à partir des lignes, arrondis au centime.
- Seules les ressources du cours sont reproduites (pas de `recipes`, `quotes`, `/image`, `/http`).

## Mettre à jour les données

`npm run importer` télécharge à nouveau les données et les images de DummyJSON (Internet nécessaire, environ une
minute) ; `npm run fixtures` enregistre à nouveau les réponses de référence des tests.
