# Énoncés des exercices — Jour 1

Formation « React JS, développer des applications web modernes ». Les énoncés se copient tels quels ; les corrigés sont remis après chaque exercice.

## Exercice 1.1-A — La langue et le titre de l'onglet (2 min)

Dossier : `~/projets/formation-react/trombi`.

1. Ouvrir le fichier `index.html`.
2. Passer la langue de la page en français (attribut `lang` de la balise `<html>`).
3. Remplacer le titre de l'onglet, `trombi`, par `Trombi`.
4. Relancer `npm run dev`, puis ouvrir `http://localhost:5173`.

Résultat attendu : l'onglet du navigateur affiche « Trombi », et la page le titre « Trombi » sur le fond de l'application.

## Exercice 1.1-B — Le modèle d'un collaborateur (4 min)

Dossier : `~/projets/formation-react/trombi`.

1. Créer le fichier `src/types.ts`.
2. Y exporter le type `Role` : l'une des chaînes `'admin'`, `'moderator'` ou `'user'`.
3. Y exporter l'interface `Collaborator` : `id` (nombre) ; `firstName`, `lastName`, `email`, `phone` et `image` (chaînes) ; `role` (`Role`) ; `company`, un objet avec `department` et `title` (chaînes) ; `address`, un objet avec `city` et `country` (chaînes).
4. Lancer `npx tsc -b`.

Résultat attendu : `npx tsc -b` n'affiche rien, aucune erreur.

## Exercice 1.3-B — L'en-tête et la recherche, du HTML au JSX (4 min)

Dossier : `~/projets/formation-react/trombi`.

1. Ouvrir `src/App.tsx`.
2. Remplacer le `h1` et le `p` par ce HTML, traduit en JSX :

```html
<header class="app-header">
  <div class="brand">
    <span class="brand-logo" aria-hidden="true">T</span>
    <div>
      <h1>Trombi</h1>
      <p>L'annuaire des collaborateurs</p>
    </div>
  </div>
</header>
<div class="toolbar">
  <label for="recherche" class="sr-only">Rechercher</label>
  <input id="recherche" class="search" type="search" placeholder="Rechercher un collaborateur…">
</div>
```

3. Enregistrer, puis regarder la page de Trombi (http://localhost:5173).

Résultat attendu : l'en-tête avec le logo « T », la barre de recherche, et aucune erreur dans la console.

## Exercice 1.3-C — La liste des collaborateurs (5 min)

Dossier : `~/projets/formation-react/trombi`.

1. Dans `src/App.tsx`, importer `sampleCollaborators` depuis `./data/collaborators.ts`, puis le ranger dans une constante `collaborators`, au début de `App`.
2. Sous la barre de recherche, afficher le nombre de collaborateurs dans un `<p>`.
3. Afficher la liste dans `<ul className="card-grid">` : pour chaque collaborateur, un `<li>` dont la clé est `c.id`, avec la photo (`<img className="avatar" src={c.image} alt="" width={56} height={56} />`), le prénom et le nom dans un `<strong>`, puis ` · ` et le poste (`c.company.title`).

Résultat attendu : « 12 collaborateurs » et les douze lignes, avec leur photo (servie par l'API du cours, qui doit tourner).

## Exercice 1.3-D — Le badge Admin (4 min)

Dossier : `~/projets/formation-react/trombi`.

1. Dans la liste de `src/App.tsx`, après le poste, ajouter le badge `<span className="badge badge-admin">Admin</span>`.
2. Ne l'afficher que pour les collaborateurs dont le rôle (`c.role`) vaut `admin`.

Résultat attendu : le badge à côté d'Emily, Michael, Sophia et Emma, les quatre administrateurs des données.

## Exercice 1.5-A — Le composant CollaboratorCard (4 min)

Dossier : `~/projets/formation-react/trombi`.

1. Créer le fichier `src/components/CollaboratorCard.tsx`.
2. Y écrire le composant `CollaboratorCard`, qui reçoit la prop `collaborator`, de type `Collaborator` (importé depuis `../types.ts`).
3. Lui faire afficher, dans un `<li>` : la photo, le prénom et le nom dans un `<h3>`, le poste (`company.title`) et le service (`company.department`) dans deux `<p>`, puis le badge Admin.
4. L'exporter par défaut.
5. Dans `src/App.tsx`, remplacer le `<li>` de la liste par `<CollaboratorCard key={c.id} collaborator={c} />`.

Résultat attendu : la même liste, avec le service en plus ; la clé `key` reste dans `App`, là où se fait la boucle.

## Exercice 1.5-B — Le composant Header (3 min)

Dossier : `~/projets/formation-react/trombi`.

1. Créer le fichier `src/components/Header.tsx`.
2. Y déplacer l'en-tête de `App` (`<header className="app-header">…</header>`), dans un composant `Header` exporté par défaut.
3. Dans `src/App.tsx`, importer `Header` et le placer à la place de l'en-tête.

Résultat attendu : l'écran ne change pas ; l'onglet Components montre `App`, `Header` et douze `CollaboratorCard`.

## Exercice 1.6-A — L'interface des props de la carte (2 min)

Dossier : `~/projets/formation-react/trombi`.

1. Dans `src/components/CollaboratorCard.tsx`, déclarer l'interface `CollaboratorCardProps`, avec la prop `collaborator`, de type `Collaborator`.
2. Typer les props du composant avec cette interface.

Résultat attendu : rien ne change à l'écran, et l'éditeur ne signale aucune erreur.

## Exercice 1.6-B — Le composant Avatar (8 min)

Dossier : `~/projets/formation-react/trombi`.

1. Créer le fichier `src/components/Avatar.tsx`.
2. Y déclarer l'interface des props : `name` (texte, obligatoire), `src` (texte, facultatif : l'adresse de la photo), `size` (nombre, facultatif, 56 par défaut : la taille en pixels).
3. S'il y a une photo, afficher `<img className="avatar" src={src} alt="" width={size} height={size} />`.
4. Sinon, afficher les initiales du nom (« Emily Johnson » donne « EJ ») dans `<span className="avatar avatar-initials" style={{ width: size, height: size }}>`. Indice : `name.split(' ')` découpe le nom en mots, `part[0]` donne la première lettre d'un mot.
5. L'exporter par défaut.
6. Dans `CollaboratorCard`, remplacer l'`<img>` par `<Avatar name={…} src={image} />`, avec le prénom et le nom.

Résultat attendu : les photos s'affichent comme avant ; en retirant un instant `src={image}`, les initiales apparaissent.

## Exercice 1.6-C — Le composant Panel (5 min)

Dossier : `~/projets/formation-react/trombi`.

1. Créer le fichier `src/components/Panel.tsx`.
2. Y écrire le composant `Panel`, avec trois props : `title` (texte), `actions` (facultative) et `children`, ces deux dernières de type `ReactNode` (importé de `react`).
3. Lui faire renvoyer une `<section className="panel">` qui contient un `<header className="panel-header">` (le titre dans un `<h2>`, puis, si elles sont fournies, les actions dans un `<div className="panel-actions">`) et un `<div className="panel-body">` avec le contenu.
4. L'exporter par défaut.

Résultat attendu : l'éditeur ne signale aucune erreur ; rien ne change encore à l'écran.

## Exercice 1.6-D — L'annuaire dans un Panel (5 min)

Dossier : `~/projets/formation-react/trombi`.

1. Dans `src/App.tsx`, importer `Panel`.
2. Remplacer le `<p>` du nombre de collaborateurs et la liste par un `Panel` de titre « Annuaire », qui contient la liste.
3. Lui passer le nombre de collaborateurs dans `actions` : `<span>{collaborators.length} collaborateurs</span>`.

Résultat attendu : l'annuaire dans son cadre, avec le nombre de collaborateurs à droite du titre.

## Exercice 1.7-A — Le module de la carte (3 min)

Dossier : `~/projets/formation-react/trombi`.

1. Créer le fichier `src/components/CollaboratorCard.module.css` et y coller le module CSS fourni, que je mets dans le chat :

Fichier `trombi/src/components/CollaboratorCard.module.css` :

```css
.card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
}
.card:hover { border-color: var(--primary); }
.selected { border-color: var(--primary); box-shadow: 0 0 0 2px var(--primary); }
.texts { flex: 1; min-width: 0; }
.name { margin: 0; font-size: 16px; }
.select { padding: 0; border: none; background: none; font-weight: 700; text-align: left; cursor: pointer; }
.select::after { content: ''; position: absolute; inset: 0; }
.title,
.department { margin: 0; font-size: 13px; color: var(--muted); }
.department { font-weight: 600; }
.favorite {
  position: relative;
  z-index: 1;
  align-self: flex-start;
  border: none;
  background: none;
  color: var(--accent);
  font-size: 22px;
  cursor: pointer;
}
```

2. Ouvrir `src/components/CollaboratorCard.tsx`.
3. Y importer le module : `import styles from './CollaboratorCard.module.css'`.
4. Donner la classe `styles.card` au `li`.
5. Regrouper le nom, le poste, le service et le badge dans un `div`.
6. Donner les classes `styles.name`, `styles.title` et `styles.department` au nom, au poste et au service.
7. Dans `src/index.css`, supprimer le style provisoire des cartes, collé à la partie 3 : les cinq règles `.card-grid > li`, à la fin du fichier.

Résultat attendu : des cartes encadrées, l'avatar à gauche, les textes à droite.

## Exercice 1.7-B — La taille de l'avatar en style en ligne (3 min)

Dossier : `~/projets/formation-react/trombi`.

1. Ouvrir `src/components/Avatar.tsx`.
2. Y importer le type `CSSProperties` de `react`.
3. Dans `Avatar`, déclarer une constante `style` de type `CSSProperties` : `width` et `height` valent `size`, `fontSize` vaut `size * 0.4`.
4. Appliquer `style={style}` aux deux cas : le `span` des initiales et l'`img`.

Résultat attendu : les avatars gardent leur taille de 56 pixels, et leur style est réglé au même endroit pour la photo et pour les initiales.

## Exercice 1.7-C — Le bouton jour / nuit (4 min)

Dossier : `~/projets/formation-react/trombi`.

1. Créer le fichier `src/components/ThemeToggle.tsx`.
2. Y écrire le composant `ThemeToggle` : un bouton (`type="button"`, classe `theme-toggle`, `aria-label="Changer de thème"`) qui affiche 🌙.
3. Au clic, basculer l'attribut `data-theme` de la balise `<html>` (`document.documentElement.dataset.theme`) entre `clair` et `sombre`.
4. Ouvrir `src/components/Header.tsx`, y importer `ThemeToggle` et l'afficher à la fin de l'en-tête.
5. Cliquer sur la lune.

Résultat attendu : la page passe en sombre, mais l'icône reste la lune.

## Exercice 1.7-D — Lire la recherche (3 min)

Dossier : `~/projets/formation-react/trombi`.

1. Ouvrir `src/App.tsx`.
2. Y importer le type `ChangeEvent` de `react`.
3. Y déclarer `handleSearch(event: ChangeEvent<HTMLInputElement>)`, qui affiche dans la console `Recherche :` suivi de `event.target.value`.
4. La brancher sur le champ de recherche : `onChange={handleSearch}`.
5. Ouvrir la console (F12) et taper quelques lettres dans la recherche.

Résultat attendu : une ligne `Recherche : …` par lettre tapée.

## Exercice 1.8-A — Le thème et la recherche dans l'état (6 min)

Dossier : `~/projets/formation-react/trombi`.

1. Ouvrir `src/types.ts` et y ajouter `export type Theme = 'clair' | 'sombre'`.
2. Ouvrir `src/components/ThemeToggle.tsx` et y ranger le thème dans un état : `useState<Theme>('clair')`.
3. Y calculer `next`, le thème proposé par le bouton, puis, au clic, appeler `setTheme(next)` avant de mettre à jour `data-theme`.
4. Y afficher 🌙 en thème clair et ☀️ en thème sombre.
5. Ouvrir `src/App.tsx` et y remplacer `handleSearch` par un état `query`, branché sur le champ : `value={query}` et `onChange={(event) => setQuery(event.target.value)}`.
6. Y calculer `visible`, les collaborateurs dont le prénom et le nom contiennent la recherche (sans tenir compte des majuscules), et afficher `visible` à la place de `collaborators`.
7. Afficher `{visible.length} / {collaborators.length}` dans les actions du panneau, et « Aucun collaborateur ne correspond à la recherche. » quand la liste est vide.

Résultat attendu : l'icône suit le thème ; taper « li » laisse 4 collaborateurs sur 12.

## Exercice 1.8-B — Le filtre par service (5 min)

Dossier : `~/projets/formation-react/trombi`.

1. Ouvrir `src/App.tsx`.
2. Y ajouter un état `department`, vide au départ (vide veut dire « tous les services »).
3. Y calculer `departments`, la liste des services sans doublon et triée : `[...new Set(tableau)].sort()`.
4. Ajouter à la barre d'outils une liste déroulante `<select id="service">`, avec le libellé masqué « Filtrer par service » : une option « Tous les services » (valeur vide), puis une option par service.
5. Ne garder dans `visible` que les collaborateurs du service choisi, ou tous si la valeur est vide.

Résultat attendu : choisir un service ne laisse que ses collaborateurs, et la recherche s'ajoute au filtre.

## Exercice 1.9-A — Charger l'annuaire (6 min)

Dossier : `~/projets/formation-react/trombi`.

1. Vérifier que l'API du cours répond : `curl http://localhost:4000/test` affiche `{"status":"ok","method":"GET"}`.
2. Ouvrir `src/App.tsx`, y importer le type `Collaborator` (`import type { Collaborator } from './types.ts'`), puis déclarer la constante `API_URL` (`'http://localhost:4000/users?limit=0&select=firstName,lastName,email,phone,image,role,company,address'`) et l'interface `UsersResponse` (`users: Collaborator[]`).
3. Remplacer la constante `collaborators` (les données d'exemple) par un état initialisé avec un tableau vide, retirer l'import de `sampleCollaborators`, et ajouter les états `loading` (`true` au départ) et `error` (`string | null`).
4. Écrire un `useEffect` qui charge `API_URL` une seule fois : `response.ok`, `response.json()`, `setCollaborators(data.users)`, le message d'erreur dans `error`, et `loading` à `false` à la fin.
5. Dans le `Panel` de l'annuaire, afficher « Chargement des collaborateurs… » (`<p className="loading">`) pendant le chargement, « Impossible de charger l'annuaire : » suivi de l'erreur (`<p className="error" role="alert">`) en cas d'échec, et « Aucun collaborateur ne correspond à la recherche. » seulement hors de ces deux cas.
6. Remplacer `/users` par `/userz` dans `API_URL`, recharger, puis remettre `/users`.

Résultat attendu : le compteur affiche « 208 / 208 » ; avec `/userz`, « Impossible de charger l'annuaire : HTTP 404 ».

## Exercice 1.9-B — Les photos manquantes (4 min)

Dossier : `~/projets/formation-react/trombi`.

1. Faire défiler l'annuaire jusqu'en bas : une partie des photos ne s'affiche pas.
2. Ouvrir l'onglet **Network** (Réseau) des outils de développement et y repérer les requêtes d'images en échec.
3. Dans un terminal, lire la règle de l'API : `curl -s -D - -o /dev/null http://localhost:4000/users/1 | grep ratelimit`.
4. Ouvrir `src/components/Avatar.tsx` et ajouter `loading="lazy"` à la balise `img`.
5. Attendre dix secondes, recharger la page, puis la faire défiler lentement.

Résultat attendu : au chargement de la page, plus aucune photo n'est refusée ; en descendant dans la liste, des photos manquent encore, car la limite de l'API reste la même.
