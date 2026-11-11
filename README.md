# Formation React JS : le dépôt du cours

Formation « React JS, développer des applications web modernes » (3 jours), par ZENITH.

Ce dépôt contient l'API du cours, un serveur Express qui répond comme DummyJSON (mêmes adresses, mêmes données, mêmes
comptes), et, sur des branches, le départ de chaque journée, Trombi à la fin de chaque journée et les supports. Les deux
applications React de la formation, le projet des exemples et Trombi, se créent pendant le cours.

## Les branches

| Branche | Ce qu'elle contient | Quand s'en servir |
|---|---|---|
| `main` | l'API du cours seule (`api/`) | le premier jour, avant de créer ses projets |
| `debut-jour-2` | le départ du jour 2 : l'API, Trombi à la fin du jour 1 et le projet des exemples | le matin du jour 2 |
| `debut-jour-3` | le départ du jour 3 : l'API, Trombi à la fin du jour 2 et le projet des exemples | le matin du jour 3 |
| `jour-1`, `jour-2` | Trombi seul, à la fin de chaque journée : le corrigé du jour | pour comparer avec son propre code |
| `supports` | les supports des journées déjà faites (`formation-react-jourN-apprenant.html`) et leurs énoncés | chaque matin, pour relire la veille |

## Commencer une journée

Dans Git Bash (sous Windows) ou dans un terminal. Fermer d'abord VS Code et les terminaux ouverts sur
`~/projets/formation-react`, mettre ce dossier de côté, puis cloner la branche du jour. Le matin du jour 3 :

```bash
cd ~/projets
mv formation-react formation-react-jour2
git clone -b debut-jour-3 https://github.com/adamfrance/formation-react.git formation-react
```

Le matin du jour 2, c'était `formation-react-jour1` et `debut-jour-2`. Ensuite, chaque projet occupe son terminal :
`api` (`npm install`, puis `npm start`), `trombi` et `demos` (`npm install`, puis `npm run dev`). Le README de la
branche détaille chaque étape.

## Relire les supports

```bash
cd ~/projets/formation-react
git clone -b supports https://github.com/adamfrance/formation-react.git supports
```

Puis ouvrir `supports/formation-react-jour2-apprenant.html` dans le navigateur.

## Lancer l'API seule

```bash
mkdir -p ~/projets && cd ~/projets
git clone https://github.com/adamfrance/formation-react.git
cd formation-react/api
npm install
npm start
```

L'API répond sur `http://localhost:4000` (essai : `curl http://localhost:4000/test`). Les adresses, les comptes et
les différences avec DummyJSON sont décrits dans `api/README.md`.
