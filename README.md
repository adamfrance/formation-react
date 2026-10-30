# Formation React JS : l'API du cours

Formation « React JS, développer des applications web modernes » (3 jours), par ZENITH.

Ce dépôt ne contient que l'API du cours : un serveur Express qui répond comme DummyJSON, avec les mêmes adresses, les
mêmes données et les mêmes comptes. Les applications React de la formation (le projet des exemples, Trombi, la
Marketplace), vous les créez vous-mêmes pendant le cours, dans ce même dossier.

## Récupérer et lancer l'API

Dans Git Bash (sous Windows) ou dans un terminal :

```bash
mkdir -p ~/projets && cd ~/projets
git clone https://github.com/adamfrance/formation-react.git
cd formation-react/api
npm install
npm start
```

L'API répond sur `http://localhost:4000` (essai : `curl http://localhost:4000/test`). Les adresses, les comptes et
les différences avec DummyJSON sont décrits dans `api/README.md`.
