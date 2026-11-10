// Ce que devient le JSX : Vite 8 le compile avec Oxc, comme ici
// node scripts/compiler-jsx.mjs : l'exemple ci-dessous ; suivi d'un nom de fichier : ce fichier, compilé
import { readFile } from 'node:fs/promises'
import { transformWithOxc } from 'vite'

const fichier = process.argv[2]
const source = fichier
  ? await readFile(fichier, 'utf8')
  : `export const element = <h1 className="titre">Bonjour {name} !</h1>`

const { code } = await transformWithOxc(source, fichier ?? 'exemple.jsx', { jsx: { runtime: 'automatic' } })
console.log(code)
