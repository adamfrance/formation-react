# Formation React JS : départ du jour 3

Formation « React JS, développer des applications web modernes » (3 jours), par ZENITH.

Cette branche contient tout ce qu'il faut pour commencer le jour 3 :

| Dossier | Contenu |
|---|---|
| `api/` | l'API du cours : un serveur Express qui répond comme DummyJSON (mêmes adresses, mêmes données, mêmes comptes) |
| `tribu/` | Tribu à la fin du jour 2 : l'annuaire chargé depuis l'API, le thème partagé, l'équipe projet et l'annuaire dans un store Redux Toolkit ; avec le code fourni des parties sautées le 18/11/2026 (la recherche et les filtres dans leurs composants, la fiche à onglets, les favoris dans un contexte, la vue tableau, withLoading et withError) |
| `demos/` | le projet des exemples, avec les exemples des jours 1 et 2 |

## Récupérer la branche

Dans Git Bash (sous Windows) ou dans un terminal. Fermez d'abord VS Code et les terminaux ouverts sur l'ancien dossier
`~/projets/formation-react` : la deuxième commande le met de côté (votre travail de la veille reste dans
`~/projets/formation-react-jour2`). Si ce dossier n'existe pas, elle affiche une erreur sans conséquence.

```bash
mkdir -p ~/projets && cd ~/projets
mv formation-react formation-react-jour2
git clone -b debut-jour-3 https://github.com/adamfrance/formation-react.git formation-react
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
