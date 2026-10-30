// Enregistre les vraies réponses de DummyJSON pour les cas de test/cas.js (comparées aux réponses de l'API locale)
// Usage : node scripts/enregistrer-fixtures.js   (Internet nécessaire)
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { CASES } from '../test/cas.js'

const SOURCE = 'https://dummyjson.com'
const ROOT = path.resolve(import.meta.dirname, '..')
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Les mots de passe de DummyJSON ne sont jamais renvoyés par l'API locale : on les retire des réponses enregistrées
function withoutPasswords(value) {
  if (Array.isArray(value)) return value.map(withoutPasswords)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).filter(([key]) => key !== 'password').map(([key, v]) => [key, withoutPasswords(v)]),
    )
  }
  return value
}

const recorded = []
for (const { name, method = 'GET', url, body, rawBody } of CASES) {
  const init = { method, headers: {} }
  if (body !== undefined || rawBody !== undefined) {
    init.headers['Content-Type'] = 'application/json'
    init.body = rawBody ?? JSON.stringify(body)
  }
  const response = await fetch(`${SOURCE}${url}`, init)
  const text = await response.text()
  let json = null
  try {
    json = JSON.parse(text)
  } catch {
    json = null
  }
  recorded.push({ name, status: response.status, body: withoutPasswords(json) })
  await sleep(150) // reste sous la limite de DummyJSON (100 requêtes par 10 secondes)
}

await writeFile(path.join(ROOT, 'test', 'fixtures', 'dummyjson.json'), `${JSON.stringify(recorded, null, 2)}\n`)
console.log(`${recorded.length} réponses enregistrées dans test/fixtures/dummyjson.json`)
