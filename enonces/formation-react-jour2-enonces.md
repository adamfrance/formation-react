# Énoncés des exercices — Jour 2

Formation « React JS, développer des applications web modernes ». Les énoncés se copient tels quels ; les corrigés sont remis après chaque exercice.

## Exercice 2.1-A — Charger l'annuaire (6 min)

Dossier : `~/projets/formation-react/tribu`.

1. Vérifier que l'API du cours répond : `curl http://localhost:4000/test` affiche `{"status":"ok","method":"GET"}`.
2. Ouvrir `src/App.tsx` et y déclarer la constante `API_URL` (`'http://localhost:4000/users?limit=0&select=firstName,lastName,email,phone,image,role,company,address'`) et l'interface `UsersResponse` (`users: Collaborator[]`).
3. Initialiser l'état `collaborators` avec un tableau vide au lieu de `sampleCollaborators`, et ajouter les états `loading` (`true` au départ) et `error` (`string | null`).
4. Écrire un `useEffect` qui charge `API_URL` une seule fois : `response.ok`, `response.json()`, `setCollaborators(data.users)`, le message d'erreur dans `error`, et `loading` à `false` à la fin.
5. Dans le `Panel` de l'annuaire, afficher « Chargement des collaborateurs… » (`<p className="loading">`) pendant le chargement, « Impossible de charger l'annuaire : » suivi de l'erreur (`<p className="error" role="alert">`) en cas d'échec, et « Aucun collaborateur ne correspond à la recherche. » seulement hors de ces deux cas.
6. Remplacer `/users` par `/userz` dans `API_URL`, recharger, puis remettre `/users`.

Résultat attendu : le compteur affiche « 208 / 208 » ; avec `/userz`, « Impossible de charger l'annuaire : HTTP 404 ».

## Exercice 2.1-B — Les photos manquantes (4 min)

Dossier : `~/projets/formation-react/tribu`.

1. Faire défiler l'annuaire jusqu'en bas : une partie des photos ne s'affiche pas.
2. Ouvrir l'onglet **Network** (Réseau) des outils de développement et y repérer les requêtes d'images en échec.
3. Dans un terminal, lire la règle de l'API : `curl -s -D - -o /dev/null http://localhost:4000/users/1 | grep ratelimit`.
4. Ouvrir `src/components/Avatar.tsx` et ajouter `loading="lazy"` à la balise `img`.
5. Attendre dix secondes, recharger la page, puis la faire défiler lentement.

Résultat attendu : les photos apparaissent au fil du défilement, sans trou.

## Exercice 2.1-C — Les tâches du collaborateur (5 min)

Dossier : `~/projets/formation-react/tribu`.

1. Ouvrir `src/components/CollaboratorDetail.tsx`.
2. Ajouter `id` à la déstructuration de `collaborator`.
3. Remplacer les constantes `tasks`, `loading` et `error` par trois états (`loading` vrai au départ).
4. Écrire un `useEffect` qui charge `` `http://localhost:4000/users/${id}/todos` `` avec le `signal` d'un `AbortController`, range `data.todos` dans `tasks`, et ignore l'erreur d'une requête annulée.
5. Renvoyer depuis l'effet la fonction de nettoyage, qui annule la requête ; dépendance : `[id]`.
6. Cliquer sur Emily Johnson, puis sur Zoé Martin si vous l'avez ajoutée avec le formulaire.

Résultat attendu : les deux tâches d'Emily ; pour Zoé, « Tâches indisponibles (HTTP 404) » : l'API ne la connaît pas, elle n'existe que dans votre navigateur.

## Exercice 2.1-D — Le thème synchronisé par un effet (3 min)

Dossier : `~/projets/formation-react/tribu`.

1. Ouvrir `src/components/ThemeToggle.tsx`.
2. Retirer du gestionnaire du clic la ligne qui modifie `document.documentElement.dataset.theme`.
3. Confier cette ligne à un `useEffect` qui dépend de `theme`.
4. Au clic, n'appeler plus que `setTheme(next)`.

Résultat attendu : le bouton change toujours le thème ; c'est l'effet qui recopie l'état sur la balise `html`.

## Exercice 2.2-A — Le contexte du thème (6 min)

Dossier : `~/projets/formation-react/tribu`.

1. Créer le fichier `src/contexts/ThemeContext.ts`.
2. Y écrire l'interface `ThemeContextValue` (`theme`, `toggleTheme`), le contexte `ThemeContext` (`createContext`, `null` par défaut) et le hook `useTheme`, qui lance une erreur claire s'il n'y a pas de fournisseur.
3. Créer le fichier `src/contexts/ThemeProvider.tsx`.
4. Y écrire le composant `ThemeProvider({ children })` : l'état `theme` et l'effet sur `data-theme`, déplacés depuis `ThemeToggle`, et la fonction `toggleTheme` ; il rend `<ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>`.
5. Lancer `npx oxlint`.

Résultat attendu : `Found 0 warnings and 0 errors.` ; l'écran ne change pas encore.

## Exercice 2.2-B — Brancher le contexte (4 min)

Dossier : `~/projets/formation-react/tribu`.

1. Ouvrir `src/main.tsx` et entourer `<App />` d'un `<ThemeProvider>`.
2. Ouvrir `src/components/ThemeToggle.tsx` et y supprimer l'état et l'effet.
3. Y lire `theme` et `toggleTheme` avec `useTheme()`, et appeler `toggleTheme` au clic.

Résultat attendu : le bouton jour / nuit marche comme avant ; dans l'onglet **Components** des outils de développement, `ThemeProvider` apparaît au-dessus d'`App`.

## Exercice 2.2-C — Le hook useLocalStorage (6 min)

Dossier : `~/projets/formation-react/tribu`.

1. Créer le fichier `src/hooks/useLocalStorage.ts`.
2. Y écrire `useLocalStorage<T>(key, initialValue)` : un état initialisé paresseusement depuis `localStorage` (`JSON.parse`, et la valeur initiale si la clé manque ou si la valeur est illisible), un effet qui réécrit la valeur à chaque changement, et le retour `[value, setValue] as const`.
3. Ouvrir `src/App.tsx` et y remplacer le `useState` des favoris par `useLocalStorage<number[]>('tribu.favoris', [])`.
4. Marquer deux favoris, puis recharger la page.

Résultat attendu : les favoris restent ; dans l'onglet **Application** > *Local Storage* > `http://localhost:5173`, la clé `tribu.favoris` vaut par exemple `[1,2]`.

## Exercice 2.2-D — Le thème persistant (2 min)

Dossier : `~/projets/formation-react/tribu`.

1. Ouvrir `src/contexts/ThemeProvider.tsx`.
2. Y remplacer `useState<Theme>('clair')` par `useLocalStorage<Theme>('tribu.theme', 'clair')`.
3. Passer en thème sombre, puis recharger la page.

Résultat attendu : le thème sombre est conservé ; la clé `tribu.theme` vaut `"sombre"`.

## Exercice 2.2-E — Le hook useFetch (8 min)

Dossier : `~/projets/formation-react/tribu`.

1. Créer le fichier `src/hooks/useFetch.ts`.
2. Y écrire `useFetch<T>(url)` sur le modèle de l'effet de `CollaboratorDetail` : les trois états, l'effet avec `AbortController` relancé si `url` change, et `refetch`, qui remet `loading` à `true` et relance l'effet (un compteur `attempt` dans les dépendances).
3. Ouvrir `src/App.tsx` et y remplacer les trois états et l'effet par `const { data, loading, error, refetch } = useFetch<UsersResponse>(API_URL)`.
4. Y ajouter l'état `added` (les collaborateurs proposés dans ce navigateur), calculer `collaborators` en combinant `added` et `data?.users`, et faire ajouter `handleAdd` dans `added`.
5. Ajouter au message d'erreur un bouton « Réessayer » (`className="btn"`, `onClick={refetch}`).
6. Arrêter l'API (Ctrl+C dans son terminal), recharger la page, relancer l'API (`npm start`), puis cliquer sur « Réessayer ».

Résultat attendu : « Impossible de charger l'annuaire : Failed to fetch » avec le bouton « Réessayer », puis l'annuaire revient au clic.

## Exercice 2.2-F — La fiche avec useFetch (3 min)

Dossier : `~/projets/formation-react/tribu`.

1. Ouvrir `src/components/CollaboratorDetail.tsx`.
2. Y remplacer les trois états et l'effet par un appel à `useFetch<{ todos: Task[] }>(…)`.
3. Calculer `tasks` à partir de `data` : un tableau vide tant que rien n'est arrivé.

Résultat attendu : la fiche fonctionne comme avant, avec 18 lignes de moins.

## Exercice 2.4-A — La tranche de l'équipe (5 min)

Dossier : `~/projets/formation-react/tribu`.

1. Créer le fichier `src/store/teamSlice.ts`.
2. Y exporter `TEAM_MAX` (8).
3. Y écrire avec `createSlice` la tranche `team` : état initial `{ members: [] }`, reducers `memberAdded` (pas de doublon, pas plus de `TEAM_MAX`), `memberRemoved` (un identifiant) et `teamCleared`.
4. Exporter les créateurs d'actions générés, et le reducer par défaut.
5. Lancer `npx tsc -b`.

Résultat attendu : aucune erreur.

## Exercice 2.4-B — Le bouton de la fiche et le panneau de l'équipe (7 min)

Dossier : `~/projets/formation-react/tribu`.

1. Ouvrir `src/components/CollaboratorDetail.tsx`.
2. Y lire dans le store, avec `useAppSelector`, si le collaborateur est déjà dans l'équipe et si l'équipe est complète.
3. Y ajouter, sous le badge du rôle, un bouton `btn` qui envoie `memberAdded(collaborator)` : « Ajouter à l'équipe », ou « Dans l'équipe » une fois ajouté ; inactif s'il est déjà dans l'équipe ou si l'équipe est complète.
4. Créer le fichier `src/components/TeamPanel.tsx`. Il lit les membres dans le store. Sans membre, il affiche « Aucun membre : ouvrez une fiche et cliquez « Ajouter à l'équipe ». ». Sinon : la liste `<ul className="team-list">` (avatar de 32 pixels, nom, bouton « Retirer » qui envoie `memberRemoved`), puis `<p className="hint">` avec « 3 / 8 membres », et un bouton « Vider l'équipe » (`teamCleared`).
5. Ouvrir `src/App.tsx` et afficher `TeamPanel` dans un `Panel` « Équipe projet », au-dessus du formulaire.

Résultat attendu : ouvrir une fiche, cliquer « Ajouter à l'équipe » : le collaborateur apparaît dans le panneau et le bouton devient « Dans l'équipe ». Dans l'onglet **Redux** des outils de développement, chaque clic apparaît comme une action, avec l'état après.

## Exercice 2.4-C — L'annuaire dans le store (12 min)

Dossier : `~/projets/formation-react/tribu`.

1. Créer le fichier `src/store/collaboratorsSlice.ts`, avec un état `items` (les collaborateurs de l'API), `added` (ceux proposés dans ce navigateur), `status` (`'idle' | 'loading' | 'succeeded' | 'failed'`) et `error`.
2. Y écrire le thunk `fetchCollaborators` (type `collaborators/fetchAll`) : il appelle `http://localhost:4000/users?limit=0&select=firstName,lastName,email,phone,image,role,company,address`, renvoie `users`, ou `rejectWithValue` avec le message d'erreur ; sa `condition` ne le laisse partir que depuis `idle` ou `failed`.
3. Y ajouter le reducer `collaboratorAdded` (en tête de `added`), et les trois cas du thunk dans `extraReducers`.
4. Ouvrir `src/store/index.ts` et y ajouter la tranche sous la clé `collaborators`.
5. Ouvrir `src/App.tsx` : y remplacer `useFetch` par le store (`dispatch(fetchCollaborators())` dans un `useEffect`, puis `items`, `added`, `status` et `error` lus avec `useAppSelector`) ; `handleAdd` envoie `collaboratorAdded` ; « Réessayer » relance le thunk.

Résultat attendu : l'annuaire s'affiche comme avant ; dans l'onglet **Network**, une seule requête vers `/users?limit=0…` malgré `StrictMode` ; dans l'onglet **Redux** : `collaborators/fetchAll/pending`, puis `collaborators/fetchAll/fulfilled`.

## Exercice 2.4-D — Les sélecteurs de l'annuaire (4 min)

Dossier : `~/projets/formation-react/tribu`.

1. Créer le fichier `src/store/selectors.ts`.
2. Y écrire `selectAllCollaborators` : avec `createSelector`, `added` puis `items`, en un seul tableau.
3. Y écrire `selectDepartments` : à partir de `selectAllCollaborators`, les services sans doublon et triés.
4. Ouvrir `src/App.tsx` et y lire `collaborators` et `departments` avec ces deux sélecteurs, à la place des calculs faits dans le composant.

Résultat attendu : l'annuaire et la liste des services ne changent pas.
