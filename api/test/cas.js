// Les cas comparés à DummyJSON : même requête, même statut, même corps (aux adresses d'images près)
// ignore : champs calculés au moment de la réponse (date, jetons), comparés seulement en présence
const COURSE_USERS = 'firstName,lastName,email,phone,image,role,company,address'
const COURSE_PRODUCTS = 'title,price,thumbnail,stock,category,rating'

export const CASES = [
  // Requêtes faites par les applications du cours
  { name: 'annuaire de Trombi', url: `/users?limit=0&select=${COURSE_USERS}` },
  { name: 'fiche Next.js', url: `/users/1?select=${COURSE_USERS}` },
  { name: 'tâches d’un collaborateur', url: '/users/1/todos' },
  { name: 'publications d’un collaborateur', url: '/users/5/posts' },
  { name: 'catalogue de la Marketplace', url: `/products?limit=0&select=${COURSE_PRODUCTS}` },
  { name: 'fiche produit', url: `/products/122?select=${COURSE_PRODUCTS},description,images` },
  { name: 'commandes d’un client', url: '/carts/user/1' },
  { name: 'utilisateur complet', url: '/users/1' },
  { name: 'produit complet', url: '/products/1' },

  { name: 'utilisateurs complets', url: '/users?limit=0' },
  { name: 'produits complets', url: '/products?limit=0' },

  // Pagination, sélection, tri
  { name: 'tri des produits par titre', url: '/products?sortBy=title&order=asc&select=title&limit=0' },
  { name: 'tri des produits par prix', url: '/products?sortBy=price&order=desc&select=price&limit=5' },
  { name: 'limit et select', url: '/users?limit=2&select=firstName' },
  { name: 'limite par défaut (30)', url: '/users?select=id' },
  { name: 'skip proche de la fin', url: '/users?skip=205&limit=10&select=id' },
  { name: 'skip au-delà de la fin', url: '/users?skip=300&limit=10&select=id' },
  { name: 'tri décroissant', url: '/users?limit=1&skip=5&select=firstName,age&sortBy=age&order=desc' },
  { name: 'tri croissant, ex aequo dans l’ordre', url: '/users?limit=3&sortBy=firstName&select=firstName' },
  { name: 'tri sur un champ inconnu', url: '/users?limit=2&sortBy=unknownField&select=firstName' },
  { name: 'select d’un champ imbriqué', url: '/users?limit=2&select=company.name' },
  { name: 'select d’un champ inconnu', url: '/users/1?select=firstName,unknownField' },
  { name: 'order invalide', url: '/users?sortBy=firstName&order=xyz&limit=1' },
  { name: 'limit négatif', url: '/users?limit=-1' },
  { name: 'limit non numérique', url: '/users?limit=abc' },
  { name: 'skip non numérique', url: '/users?skip=abc&limit=1' },

  // Identifiants
  { name: 'utilisateur inconnu', url: '/users/999' },
  { name: 'identifiant utilisateur invalide', url: '/users/abc' },
  { name: 'utilisateur 0', url: '/users/0' },
  { name: 'identifiant décimal', url: '/users/1.5' },
  { name: 'produit inconnu', url: '/products/999' },
  { name: 'identifiant produit invalide', url: '/products/abc' },
  { name: 'tâche invalide', url: '/todos/abc' },
  { name: 'panier invalide', url: '/carts/abc' },

  // Recherche et filtre
  { name: 'recherche par nom', url: '/users/search?q=johnson&select=firstName,lastName' },
  { name: 'recherche par identifiant', url: '/users/search?q=emilys&select=username' },
  { name: 'recherche par e-mail', url: '/users/search?q=x.dummyjson&select=id&limit=1' },
  { name: 'recherche vide', url: '/users/search?q=&limit=1&select=id' },
  { name: 'filtre imbriqué', url: '/users/filter?key=hair.color&value=Brown&select=id' },
  { name: 'filtre sensible à la casse', url: '/users/filter?key=hair.color&value=brown&select=id' },
  { name: 'filtre sur un nombre', url: '/users/filter?key=age&value=28&select=id,age' },
  { name: 'filtre sur le rôle', url: '/users/filter?key=role&value=admin&select=id,role' },
  { name: 'filtre sans clé', url: '/users/filter?value=x' },
  { name: 'recherche de produits', url: '/products/search?q=phone&select=id&limit=0' },
  { name: 'recherche de produits en majuscules', url: '/products/search?q=PHONE&select=id&limit=0' },
  { name: 'recherche apple', url: '/products/search?q=apple&select=id&limit=0' },
  { name: 'recherche laptop', url: '/products/search?q=laptop&select=id&limit=0' },
  { name: 'recherche red', url: '/products/search?q=red&select=id&limit=0' },
  { name: 'recherche watch', url: '/products/search?q=watch&select=id&limit=0' },

  // Catégories
  { name: 'catégories', url: '/products/categories' },
  { name: 'liste des catégories', url: '/products/category-list' },
  { name: 'produits d’une catégorie', url: '/products/category/smartphones?select=title&limit=0' },
  { name: 'catégorie inconnue', url: '/products/category/nope' },

  // Ressources liées
  { name: 'tâches paginées', url: '/users/5/todos?limit=1&skip=1' },
  { name: 'paniers d’un utilisateur', url: '/users/1/carts' },
  { name: 'tâches par /todos/user', url: '/todos/user/1' },
  { name: 'publications par /posts/user', url: '/posts/user/1' },
  { name: 'tâches d’un utilisateur invalide', url: '/users/abc/todos' },
  { name: 'tâches d’un utilisateur inconnu', url: '/users/999/todos' },
  { name: 'paniers d’un utilisateur inconnu', url: '/carts/user/999' },
  { name: 'paniers d’un utilisateur invalide', url: '/carts/user/abc' },

  { name: 'commentaires d’une publication', url: '/posts/1/comments?select=body&limit=2' },
  { name: 'commentaires par /comments/post', url: '/comments/post/1?select=body&limit=2' },
  { name: 'tâches d’un utilisateur invalide (/todos/user)', url: '/todos/user/abc' },
  { name: 'tâches d’un utilisateur inconnu (/todos/user)', url: '/todos/user/999' },
  { name: 'recherche de publications', url: '/posts/search?q=love&select=id&limit=0' },

  // Autres ressources
  { name: 'tâches', url: '/todos?limit=5' },
  { name: 'tâche', url: '/todos/1' },
  { name: 'publications', url: '/posts?limit=3&select=title' },
  { name: 'publication', url: '/posts/1' },
  { name: 'commentaires', url: '/comments?limit=3' },
  { name: 'commentaire', url: '/comments/1' },
  { name: 'paniers', url: '/carts?limit=2' },
  { name: 'panier', url: '/carts/1' },
  { name: 'test', url: '/test' },
  { name: 'test en POST', method: 'POST', url: '/test' },
  { name: 'ressource protégée sans jeton', url: '/auth/products/1?select=title' },

  // Délai simulé
  { name: 'délai trop long', url: '/users/1?delay=6000' },
  { name: 'délai invalide', url: '/users/1?delay=abc&select=id' },
  { name: 'délai de 200 ms', url: '/users/1?delay=200&select=id' },

  // Écritures simulées
  { name: 'ajout d’un utilisateur', method: 'POST', url: '/users/add', body: { firstName: 'Ada', lastName: 'Lovelace' } },
  { name: 'ajout d’un utilisateur vide', method: 'POST', url: '/users/add', body: {} },
  { name: 'modification d’un utilisateur', method: 'PUT', url: '/users/1', body: { lastName: 'Owais' } },
  { name: 'suppression d’un utilisateur', method: 'DELETE', url: '/users/1', ignore: ['deletedOn'] },
  { name: 'tâche cochée (PUT)', method: 'PUT', url: '/todos/1', body: { completed: false } },
  { name: 'tâche renommée (PATCH)', method: 'PATCH', url: '/todos/1', body: { todo: 'Lire' } },
  { name: 'tâche inconnue (PUT)', method: 'PUT', url: '/todos/99999', body: { completed: true } },
  { name: 'tâche invalide (PUT)', method: 'PUT', url: '/todos/abc', body: { completed: true } },
  { name: 'suppression d’une tâche', method: 'DELETE', url: '/todos/1', ignore: ['deletedOn'] },
  { name: 'ajout d’une tâche', method: 'POST', url: '/todos/add', body: { todo: 'Test', completed: false, userId: 5 } },
  { name: 'ajout d’une tâche sans utilisateur', method: 'POST', url: '/todos/add', body: { todo: 'Test' } },
  { name: 'ajout d’une tâche réduite', method: 'POST', url: '/todos/add', body: { userId: 5 } },
  { name: 'ajout d’une publication', method: 'POST', url: '/posts/add', body: { title: 'x', userId: 5 } },
  { name: 'ajout d’une publication sans utilisateur', method: 'POST', url: '/posts/add', body: { title: 'x' } },
  { name: 'ajout d’un commentaire', method: 'POST', url: '/comments/add', body: { body: 'x', postId: 1, userId: 5 } },
  { name: 'commentaire sans publication', method: 'POST', url: '/comments/add', body: { body: 'x', userId: 5 } },
  { name: 'commentaire sans texte', method: 'POST', url: '/comments/add', body: { postId: 1, userId: 5 } },
  { name: 'ajout d’un produit', method: 'POST', url: '/products/add', body: { title: 'x' } },
  { name: 'ajout d’un produit vide', method: 'POST', url: '/products/add', body: {} },
  { name: 'commande', method: 'POST', url: '/carts/add', body: { userId: 1, products: [{ id: 144, quantity: 2 }, { id: 98, quantity: 1 }] } },
  { name: 'commande sans client', method: 'POST', url: '/carts/add', body: { products: [{ id: 1, quantity: 1 }] } },
  { name: 'commande sans produit', method: 'POST', url: '/carts/add', body: { userId: 1 } },
  { name: 'commande d’un produit inconnu', method: 'POST', url: '/carts/add', body: { userId: 1, products: [{ id: 99999, quantity: 1 }] } },
  { name: 'commande mal formée', method: 'POST', url: '/carts/add', body: { userId: 1, products: 'x' } },
  { name: 'commande d’un client inconnu', method: 'POST', url: '/carts/add', body: { userId: 999, products: [{ id: 1, quantity: 1 }] } },
  { name: 'commande sans quantité', method: 'POST', url: '/carts/add', body: { userId: 1, products: [{ id: 1 }] } },
  { name: 'JSON invalide', method: 'POST', url: '/users/add', rawBody: '{bad json' },

  // Connexion (les jetons et l’expiration sont testés à part)
  { name: 'connexion réussie', method: 'POST', url: '/auth/login', body: { username: 'emilys', password: 'emilyspass' }, ignore: ['accessToken', 'refreshToken'] },
  { name: 'mauvais mot de passe', method: 'POST', url: '/auth/login', body: { username: 'emilys', password: 'wrong' } },
  { name: 'utilisateur inconnu à la connexion', method: 'POST', url: '/auth/login', body: { username: 'nobody', password: 'x' } },
  { name: 'connexion sans mot de passe', method: 'POST', url: '/auth/login', body: { username: 'emilys' } },
  { name: 'profil sans jeton', url: '/auth/me' },
  { name: 'rafraîchissement sans jeton', method: 'POST', url: '/auth/refresh', body: {} },
  { name: 'rafraîchissement avec un faux jeton', method: 'POST', url: '/auth/refresh', body: { refreshToken: 'x.y.z' } },
]
