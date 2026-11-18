# Formation React JS : départ du jour 2

Formation « React JS, développer des applications web modernes » (3 jours), par ZENITH.

Cette branche contient tout ce qu'il faut pour commencer le jour 2 :

| Dossier | Contenu |
|---|---|
| `api/` | l'API du cours : un serveur Express qui répond comme DummyJSON (mêmes adresses, mêmes données, mêmes comptes) |
| `tribu/` | Tribu à la fin du jour 1 : la liste des collaborateurs, la recherche, le filtre par service, les favoris, le formulaire d'ajout, le thème jour / nuit |
| `demos/` | le projet des exemples, avec les 12 exemples du jour 1 |

## Récupérer la branche

Dans Git Bash (sous Windows) ou dans un terminal. Fermez d'abord VS Code et les terminaux ouverts sur l'ancien dossier
`~/projets/formation-react` : la deuxième commande le met de côté (votre travail de la veille reste dans
`~/projets/formation-react-jour1`). Si ce dossier n'existe pas, elle affiche une erreur sans conséquence.

```bash
mkdir -p ~/projets && cd ~/projets
mv formation-react formation-react-jour1
git clone -b debut-jour-2 https://github.com/adamfrance/formation-react.git formation-react
```

## Installer et lancer les projets

Chaque projet occupe son terminal toute la journée.

Premier terminal, l'API :

```bash
cd ~/projets/formation-react/api
npm install
npm start
```

Deuxième terminal, Tribu :

```bash
cd ~/projets/formation-react/tribu
npm install
npm run dev
```

Troisième terminal, les exemples :

```bash
cd ~/projets/formation-react/demos
npm install
npm run dev
```

Résultat attendu : l'API répond sur `http://localhost:4000` (essai : `curl http://localhost:4000/test`), Tribu sur
`http://localhost:5173` et les exemples sur `http://localhost:5180`.

Les adresses, les comptes et les différences avec DummyJSON sont décrits dans `api/README.md`.
