# Énoncés des exercices — Jour 3

Formation « React JS, développer des applications web modernes ». Les énoncés se copient tels quels ; les corrigés sont remis après chaque exercice.

## Exercice 3.1-A — Les routes de Tribu (5 min)

Dossier : `~/projets/formation-react/tribu`.

1. Ouvrir `src/main.tsx` et y envelopper `<App />` dans `<BrowserRouter>`, importé de `react-router`.
2. Créer `src/layouts/RootLayout.tsx` : le chargement des collaborateurs (`dispatch(fetchCollaborators())` dans un `useEffect`), puis `<Header />` et `<Outlet />` dans `<div className="app">`.
3. Remplacer le contenu de `src/App.tsx` par les routes : une route de mise en page `RootLayout`, avec `index` (`HomePage`), `annuaire` (`DirectoryPage`) et `equipe` (`TeamPage`).
4. Dans `src/components/Header.tsx`, ajouter après le logo un `<nav className="nav" aria-label="Navigation principale">` avec trois `NavLink` : Accueil (`/`, avec `end`), Annuaire (`/annuaire`), Équipe (`/equipe`).
5. Ouvrir http://localhost:5173 et cliquer sur les trois liens, puis sur le bouton Précédent du navigateur.

Résultat attendu : l'adresse change sans rechargement, le lien de la page affichée est mis en valeur, et Précédent revient à la page d'avant.

## Exercice 3.1-C — La fiche à son adresse (5 min)

Dossier : `~/projets/formation-react/tribu`.

1. Créer le fichier `src/pages/CollaboratorPage.tsx`.
2. Y lire `id` avec `useParams`, et chercher le collaborateur dans le store (`selectAllCollaborators`) avec `Number(id)`.
3. S'il n'est pas trouvé : la roue (`<div className="spinner" role="status" aria-label="Chargement" />`) tant que `state.collaborators.status` vaut `idle` ou `loading`, sinon « Collaborateur introuvable » et un `Link` vers `/annuaire`.
4. S'il est trouvé : un `Panel` « Fiche » qui contient `<CollaboratorDetail key={collaborator.id} collaborator={collaborator} />`, avec dans `actions` un bouton « ← Retour » qui appelle `navigate(-1)`.
5. Dans `src/App.tsx`, ajouter la route `annuaire/:id`.
6. Ouvrir http://localhost:5173/annuaire/1, puis http://localhost:5173/annuaire/999.

Résultat attendu : la fiche d'Emily Johnson, puis « Collaborateur introuvable ».

## Exercice 3.1-D — La recherche et les filtres dans l'adresse (6 min)

Dossier : `~/projets/formation-react/tribu`.

1. Ouvrir le fichier `src/pages/DirectoryPage.tsx`.
2. Y remplacer les états `query` et `filters` par `useSearchParams` : `q` pour la recherche, `service` pour le service, `favoris=1` pour « Favoris uniquement ».
3. Y écrire `updateParams(changes)`, qui change une ou plusieurs valeurs en gardant les autres, retire une valeur vide, et utilise `{ replace: true }`.
4. Brancher `SearchBar` et `Filters` sur `updateParams`.
5. Dans `src/pages/NotFoundPage.tsx`, afficher l'adresse demandée (`useLocation().pathname`) dans la phrase.
6. Filtrer sur Engineering, taper « a », puis recharger la page.

Résultat attendu : l'adresse devient `/annuaire?service=Engineering&q=a`, le compteur affiche 16 / 208, et le rechargement garde la recherche et le filtre ; http://localhost:5173/organigramme affiche l'adresse demandée.

## Exercice 3.2-B — La garde RequireAuth (4 min)

Dossier : `~/projets/formation-react/tribu`.

1. Créer le fichier `src/components/RequireAuth.tsx`, avec deux props : `children` et `role`, facultatif (type `Role`).
2. Y lire l'utilisateur connecté dans le store (`state.auth.user`) et l'adresse courante (`useLocation`).
3. S'il n'est pas connecté : renvoyer `<Navigate to="/connexion" state={{ from: location.pathname }} replace />`.
4. S'il est connecté sans le rôle demandé : renvoyer `<p className="error" role="alert">Cette page est réservée aux administrateurs.</p>`.
5. Sinon : renvoyer `children`.

Résultat attendu : `npx tsc -b` n'affiche rien ; la garde sert à l'exercice suivant.

## Exercice 3.2-C — L'espace personnel protégé (5 min)

Dossier : `~/projets/formation-react/tribu`.

1. Ouvrir le fichier `src/App.tsx`.
2. Y ajouter la route `connexion` (`LoginPage`).
3. Y ajouter la route `mon-espace`, protégée par `RequireAuth`, qui affiche `AccountLayout`, avec deux routes imbriquées : `index` (`ProfilePage`) et `taches` (`MyTasksPage`).
4. Dans `src/components/Header.tsx`, afficher dans la navigation « Connexion » (lien vers `/connexion`) ou, une fois connecté, le prénom (lien vers `/mon-espace`) et un bouton « Déconnexion » qui envoie `logout()`.
5. Ouvrir http://localhost:5173/mon-espace/taches sans être connecté, se tromper de mot de passe, puis se connecter en `emilys` / `emilyspass`.
6. Recharger la page.

Résultat attendu : la redirection vers la connexion, le message « Identifiant ou mot de passe incorrect », puis le retour automatique aux tâches (Learn Javascript, Listen to a new music genre) ; après le rechargement, on reste connecté (outils de développement, onglet Application > Session Storage : la clé `tribu.session`).

## Exercice 3.3-B — Les pages peu visitées à la demande (5 min)

Dossier : `~/projets/formation-react/tribu`.

1. Lancer `npm run build` et noter la taille du fichier `index-….js`.
2. Ouvrir le fichier `src/App.tsx` : y importer `lazy`, et charger à la demande `CollaboratorPage`, `TeamPage`, `LoginPage`, `AdminPage` et `NotFoundPage`, sur le modèle `const TeamPage = lazy(() => import('./pages/TeamPage.tsx'))`.
3. Ouvrir le fichier `src/layouts/RootLayout.tsx` : y entourer `<Outlet />` d'un `<Suspense>` dont la solution d'attente est `<div className="spinner" role="status" aria-label="Chargement de la page" />`.
4. Relancer `npm run build`.

Résultat attendu : un fichier par page chargée à la demande, et un fichier `index-….js` plus léger.

## Exercice 3.4-A — Le premier test : le badge du rôle (5 min)

Dossier : `~/projets/formation-react/tribu`.

1. Créer le fichier `src/components/RoleBadge.test.tsx`.
2. Y écrire un `describe('RoleBadge', …)` avec trois tests : « Admin » s'affiche pour `role="admin"`, « Modérateur » pour `role="moderator"`, et rien pour `role="user"` (le `container` renvoyé par `render` est vide : `toBeEmptyDOMElement()`).
3. Lancer `npm test`.
4. Remplacer `'Admin'` par `'Administrateur'` dans le premier test, enregistrer, lire la sortie de Vitest, puis remettre `'Admin'`.
5. Quitter Vitest avec la touche `q`.

Résultat attendu : trois tests verts ; avec « Administrateur », un test rouge, et Vitest affiche le DOM du badge, qui contient « Admin ».

## Exercice 3.4-C — La carte d'un collaborateur (4 min)

Dossier : `~/projets/formation-react/tribu`.

1. Créer le fichier `src/components/CollaboratorCard.test.tsx`.
2. Y importer `sampleCollaborators` (`../data/collaborators.ts`) et prendre Emily Johnson, la première.
3. Y écrire un composant `Wrapper` qui place ses enfants dans un `MemoryRouter` (la carte contient un `Link`) et dans le `FavoritesProvider` (la carte lit les favoris dans le contexte) ; vider `localStorage` avant chaque test (`beforeEach`).
4. Premier test : la carte affiche le nom en lien vers `/annuaire/1`, le poste « Sales Manager » et le badge « Admin » ; l'afficher avec l'option `{ wrapper: Wrapper }` de `render`.
5. Second test : le bouton « Emily Johnson en favori » a `aria-pressed` à `false` ; après un clic (`userEvent.setup()`, `await user.click(…)`), il passe à `true`.
6. Lancer `npx vitest run src/components/CollaboratorCard.test.tsx`.

Résultat attendu : deux tests verts.

## Exercice 3.4-D — Le formulaire de l'administration (5 min)

Dossier : `~/projets/formation-react/tribu`.

1. Créer le fichier `src/components/NewCollaboratorForm.test.tsx` ; le formulaire s'affiche avec `departments={['Engineering']}`.
2. Premier test : le bouton « Ajouter à l'annuaire » est inactif (`toBeDisabled()`).
3. Deuxième test : taper `zoe.martin@` dans le champ « E-mail », puis quitter le champ (`await user.tab()`) : « Format d'e-mail invalide » s'affiche.
4. Troisième test : remplir Prénom « Zoé », Nom « Martin », E-mail `zoe.martin@exemple.fr`, Service « Engineering » (`user.selectOptions`) et Poste « Développeuse React », puis cliquer sur le bouton.
5. Y vérifier que `onAdd` est appelée une fois, avec `expect.objectContaining({ firstName: 'Zoé', company: { department: 'Engineering', title: 'Développeuse React' } })`, que le message de rôle `status` annonce « Zoé Martin a rejoint l'annuaire. » et que le champ Prénom est vide.
6. Lancer `npx vitest run`.

Résultat attendu : `Test Files  4 passed (4)` et `Tests  11 passed (11)`.

## Exercice 3.4-F — Les publications d'un collaborateur (5 min)

Dossier : `~/projets/formation-react/tribu`.

1. Créer le fichier `src/components/CollaboratorPosts.test.tsx`.
2. Premier test : afficher `<CollaboratorPosts id={1} />` ; « Chargement des publications… » s'affiche tout de suite, puis « Bienvenue dans Tribu » arrive (`await screen.findByText(…)`), et la liste a deux éléments (`getAllByRole('listitem')`).
3. Second test : pour ce test seulement, faire répondre `http://localhost:4000/users/:id/posts` par une erreur 500 (`server.use(http.get(…, () => new HttpResponse(null, { status: 500 })))`) ; l'élément de rôle `alert` contient « Publications indisponibles (HTTP 500) ».
4. Lancer `npx vitest run src/components/CollaboratorPosts.test.tsx`.

Résultat attendu : deux tests verts.

## Exercice 3.4-H — L'annuaire entier (4 min)

Dossier : `~/projets/formation-react/tribu`.

1. Créer le fichier `src/App.test.tsx`.
2. Premier test : `renderWithProviders(<App />, { route: '/annuaire' })` ; attendre « 12 / 12 » (`findByText`), taper « em » dans le champ de rôle `searchbox` et de nom « Rechercher », puis vérifier « 2 / 12 » et les liens « Emily Johnson » et « Emma Miller ».
3. Second test : partir de `'/annuaire?service=Marketing'`, attendre « 1 / 12 » et vérifier le lien « Ava Taylor ».
4. Lancer `npx vitest run src/App.test.tsx`.

Résultat attendu : deux tests verts.

## Exercice 3.4-I — Le parcours jusqu'à l'équipe (si vous avez de l'avance) (5 min)

Dossier : `~/projets/formation-react/tribu`.

1. Ouvrir le fichier `src/App.test.tsx`.
2. Y ajouter un troisième test : ouvrir `/annuaire?q=emily`, attendre puis cliquer sur « + Équipe » de la seule carte affichée (`findByRole`), puis cliquer sur le lien « Équipe » de la navigation.
3. Y vérifier que la page Équipe affiche « 1 / 8 membres · Engineering : 1 » et « Emily Johnson » ; la page Équipe est chargée à la demande (`lazy`) : l'attendre avec `findByText`.
4. Lancer `npx vitest run src/App.test.tsx`.

Résultat attendu : trois tests verts.

## Exercice 3.5-A — La frontière autour des pages (3 min)

Dossier : `~/projets/formation-react/tribu`.

1. Installer la bibliothèque : `npm install react-error-boundary`.
2. Créer le fichier `src/components/PageError.tsx` et y coller l'écran de secours fourni, que je mets dans le chat :

Fichier `tribu/src/components/PageError.tsx` :

```tsx
import { getErrorMessage } from 'react-error-boundary'
import type { FallbackProps } from 'react-error-boundary'

// L'écran de secours d'une page qui a planté : l'en-tête et la navigation restent utilisables
function PageError({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="error-boundary" role="alert">
      <h2>Cette page n'a pas pu s'afficher</h2>
      <p className="error">{getErrorMessage(error) ?? 'Erreur inconnue'}</p>
      <p>
        <button type="button" className="btn" onClick={resetErrorBoundary}>Réessayer</button>{' '}
        {/* un fichier de page qui n'a pas pu être téléchargé : React garde l'échec, seul un rechargement répare */}
        <button type="button" className="btn btn-ghost" onClick={() => location.reload()}>Recharger la page</button>
      </p>
    </div>
  )
}

export default PageError
```

::: expl
L. 1 | `getErrorMessage` : le message d'une erreur, quelle qu'elle soit (une erreur peut être n'importe quoi en JavaScript).
L. 2 | `FallbackProps` : le type des props d'un écran de secours.
L. 5 | `PageError` reçoit l'erreur (`error`) et la fonction qui l'efface (`resetErrorBoundary`).
L. 7 | Le conteneur de l'écran de secours ; `role="alert"` : un lecteur d'écran l'annonce tout de suite.
L. 8 | Le titre, qui dit ce qui s'est passé (`h2`).
L. 9 | Le message de l'erreur (`getErrorMessage`), ou « Erreur inconnue » s'il n'y en a pas (`??`).
L. 11 | « Réessayer » efface l'erreur et réaffiche la page (`resetErrorBoundary`) ; `{' '}` met une espace entre les deux boutons.
L. 13 | « Recharger la page » (`location.reload()`) : seul remède quand le fichier d'une page n'a pas pu être téléchargé, car React garde l'échec en mémoire.
L. 19 | On exporte le composant (`export default PageError`).
:::

3. Ouvrir le fichier `src/layouts/RootLayout.tsx`.
4. Y lire l'adresse courante : `const { pathname } = useLocation()`.
5. Y entourer le `Suspense` de `<ErrorBoundary FallbackComponent={PageError} resetKeys={[pathname]}>`.
6. Dans le navigateur, sur l'annuaire : DevTools, onglet **Network**, choisir **Offline**, puis cliquer sur **Équipe** (pas encore ouverte : son fichier n'est pas téléchargé).
7. Repasser en **No throttling**, cliquer sur « Réessayer », puis sur « Recharger la page ».

Résultat attendu : à l'étape 6, l'en-tête reste et la page affiche « Cette page n'a pas pu s'afficher » ; à l'étape 7, « Réessayer » ne suffit pas, « Recharger la page » répare.

## Exercice 3.6-B — Les tâches de la fiche avec useQuery (5 min)

Dossier : `~/projets/formation-react/tribu`.

1. Ouvrir le fichier `src/components/CollaboratorDetail.tsx`.
2. Y remplacer `useFetch` par `useQuery` pour les tâches : clé `['tasks', id]`, la même fonction de chargement que les publications, avec l'adresse `/users/${id}/todos` (réponse `{ todos: Task[] }`).
3. Y adapter l'affichage : `isPending`, `error.message`.
4. Ouvrir l'onglet **Tâches** d'Emily, puis le panneau de React Query.

Résultat attendu : les deux tâches d'Emily (« Learn Javascript », « Listen to a new music genre ») et une entrée `["tasks", 1]` dans le panneau.

## Exercice 3.6-E — Proposer un collaborateur au serveur (5 min)

Dossier : `~/projets/formation-react/tribu`.

1. Ouvrir le fichier `src/queries.ts` et y ajouter `addCollaborator(collaborator)` : un `POST` vers `http://localhost:4000/users/add`, le collaborateur en JSON dans le corps, une erreur si `!response.ok` ; elle renvoie le collaborateur créé.
2. Ouvrir le fichier `src/pages/AdminPage.tsx` et y créer une mutation : `mutationFn: addCollaborator` ; dans `onSuccess`, ranger l'objet renvoyé en tête de la liste du cache, avec l'identifiant envoyé (le serveur renvoie toujours 209).
3. Y passer au formulaire `onAdd={(c) => mutation.mutateAsync(c)}`, et afficher sous le formulaire « Enregistrement… » pendant l'envoi et « Enregistrement impossible (…) » en cas d'échec.
4. Ouvrir le fichier `src/components/NewCollaboratorForm.tsx` : `onAdd` peut renvoyer une promesse ; `handleSubmit` devient `async`, attend `onAdd(…)` dans un `try`, et sort sans vider le formulaire en cas d'échec.
5. Connecté en `emilys`, ouvrir l'administration, l'onglet **Network** ouvert, et proposer Zoé Martin (Engineering, Développeuse React).

Résultat attendu : une requête `POST /users/add` (statut 201, l'identifiant 209 dans la réponse), « Zoé Martin a rejoint l'annuaire. », puis Zoé en tête de l'annuaire.

## Exercice 3.6-F — Cocher une tâche (6 min)

Dossier : `~/projets/formation-react/tribu`.

1. Ouvrir le fichier `src/queries.ts` et y ajouter `updateTask(id, completed)` : un `PUT` vers `/todos/${id}` avec `{ completed }` dans le corps ; elle renvoie la tâche modifiée.
2. Ouvrir le fichier `src/pages/account/MyTasksPage.tsx` et y remplacer `useFetch` par `useQuery(tasksQuery(user?.id ?? 0))`.
3. Y écrire la mutation optimiste : `mutationFn` envoie l'inverse de `task.completed` ; `onMutate` annule les chargements, garde la liste, écrit la case inversée et renvoie la liste d'avant ; `onError` la remet ; `onSuccess` remplace la tâche par la réponse du serveur.
4. Y afficher chaque tâche dans un `<label>` avec une case à cocher (`checked={t.completed}`, `onChange={() => toggle.mutate(t)}`), et le message « Modification annulée (…) » quand `toggle.isError`.
5. Supprimer `src/hooks/useFetch.ts` : plus personne ne s'en sert.
6. Connecté en `emilys`, ouvrir `http://localhost:5173/mon-espace/taches` et cocher « Learn Javascript ».
7. Dans l'onglet **Network**, bloquer l'adresse de la tâche (clic droit sur la requête `47`, « Block request URL »), puis décocher la case.

Résultat attendu : la case se coche tout de suite (`PUT /todos/47`, statut 200) ; requête bloquée, elle revient, avec « Modification annulée (Failed to fetch) ».

## Exercice 3.7-B — La page d'accueil de Tribu public (9 min)

Dossier : `~/projets/formation-react/tribu-public` (créé au début de la partie).

1. Créer le fichier `lib/api.ts`. Y écrire le type `Collaborator` (`id`, `firstName`, `lastName`, `email`, `image`, `role`, `company` avec `department` et `title`), puis `getCollaborators()`, qui lit `http://localhost:4000/users?limit=0&select=firstName,lastName,email,image,role,company` avec `'use cache'` et `cacheLife('hours')`.
2. Remplacer le contenu de `app/layout.tsx` : les métadonnées (titre « Tribu public », modèle `%s · Tribu public`), puis l'en-tête de Tribu (classes `app`, `app-header`, `brand`, un lien « Accueil ») autour de `children`.
3. Remplacer le contenu de `app/page.tsx` : un composant `async` qui affiche le nombre de collaborateurs et de services, puis, pour chaque service, la liste de ses collaborateurs (un lien vers sa fiche, `/collaborateurs/1` pour le premier, et le poste).
4. Lancer `npm run dev`, puis ouvrir `http://localhost:3000`.
5. Dans un second terminal, compter les éléments de liste du HTML : `curl -s http://localhost:3000/ | grep -o "<li>" | wc -l`.

Résultat attendu : les 208 collaborateurs rangés par service, et 208 éléments de liste dans le HTML reçu.

## Exercice 3.8-B — L'adresse de l'API dans .env (4 min)

Dossier : `~/projets/formation-react/tribu`.

1. Créer le fichier `.env` à la racine du projet, avec `VITE_API_URL=http://localhost:4000`.
2. Créer le fichier `src/env.d.ts` : l'interface `ImportMetaEnv` avec `readonly VITE_API_URL: string`.
3. Créer le fichier `src/config.ts` : `export const API_URL = import.meta.env.VITE_API_URL`.
4. Dans `src/queries.ts`, supprimer la constante `API_URL` et l'importer depuis `./config.ts`.
5. Dans `src/store/authSlice.ts`, importer `API_URL` et l'utiliser dans les deux `fetch` (connexion et profil).
6. Lancer `npm run build`, puis `grep -o "http://localhost:4000" dist/assets/*.js`.

Résultat attendu : l'adresse apparaît en clair dans un fichier du build ; les tests passent toujours (Vitest lit le même `.env`).

## Exercice 3.8-D — Le suivi des erreurs et des mesures (si vous avez de l'avance) (5 min)

Dossier : `~/projets/formation-react/tribu`.

1. Installer la bibliothèque : `npm install web-vitals`.
2. Créer le fichier `src/monitoring.ts` : une fonction `send(kind, data)` qui écrit dans la console « [suivi] », le type (web-vitals ou erreur) et les données ; `startMonitoring()`, qui envoie LCP, INP et CLS (`onLCP`, `onINP`, `onCLS`, avec `reportAllChanges: true`) ; `reportError(error)`, qui envoie le message de l'erreur.
3. Dans `src/main.tsx`, appeler `startMonitoring()` avant le rendu.
4. Dans `src/layouts/RootLayout.tsx`, passer `onError={reportError}` à l'`ErrorBoundary`.
5. Dans `src/layouts/RootLayout.test.tsx`, vérifier que l'erreur est signalée : `expect(log).toHaveBeenCalledWith('[suivi] erreur', …)`.
6. Lancer `npm test`, puis ouvrir l'annuaire, la console du navigateur, et taper dans la recherche.
7. Lancer `npm audit`.

Résultat attendu : les tests passent ; la console affiche les mesures (`[suivi] web-vitals {name: LCP, …}`).
