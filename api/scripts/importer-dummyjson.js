// Importe une fois les données de DummyJSON dans data/ et les images dans public/ (à relancer seulement pour rafraîchir)
// Usage : npm run importer   (Internet nécessaire ; environ une minute)
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import bcrypt from 'bcryptjs'

const SOURCE = 'https://dummyjson.com'
const CDN = 'https://cdn.dummyjson.com'
const ROOT = path.resolve(import.meta.dirname, '..')
const RESOURCES = ['users', 'products', 'todos', 'posts', 'carts', 'comments']
const IMAGES_MAX_BYTES = 10 * 1024 * 1024 // au-delà, les galeries de produits restent sur le CDN de DummyJSON

// DummyJSON accepte 100 requêtes par 10 secondes : on en envoie au plus 8 par seconde vers son API
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
let lastApiCall = 0
async function throttle(url) {
  if (!url.startsWith(SOURCE)) return
  const wait = lastApiCall + 125 - Date.now()
  lastApiCall = Math.max(Date.now(), lastApiCall + 125)
  if (wait > 0) await sleep(wait)
}

async function download(url, { tries = 3 } = {}) {
  for (let attempt = 1; ; attempt += 1) {
    await throttle(url)
    const response = await fetch(url, { signal: AbortSignal.timeout(15_000) })
    if (response.ok) return response
    if (attempt >= tries || response.status < 429) throw new Error(`HTTP ${response.status} pour ${url}`)
    await sleep(2_000 * attempt)
  }
}

async function getJson(url) {
  return (await download(url)).json()
}

// Exécute les tâches avec au plus `width` téléchargements en parallèle
async function inParallel(items, width, task) {
  const queue = [...items]
  const workers = Array.from({ length: width }, async () => {
    while (queue.length > 0) await task(queue.shift())
  })
  await Promise.all(workers)
}

async function saveFile(relativePath, response) {
  const target = path.join(ROOT, 'public', relativePath)
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, Buffer.from(await response.arrayBuffer()))
}

const toLocal = (url) => (url.startsWith(CDN) ? url.slice(CDN.length) : url)

async function main() {
  const data = {}
  for (const name of RESOURCES) {
    data[name] = (await getJson(`${SOURCE}/${name}?limit=0`))[name]
    console.log(`${name} : ${data[name].length}`)
  }
  const categories = (await getJson(`${SOURCE}/products/categories`)).map(({ slug, name }) => ({ slug, name }))

  // Utilisateurs : le mot de passe devient une empreinte bcrypt, l'avatar une image servie par l'API
  for (const user of data.users) {
    user.passwordHash = await bcrypt.hash(user.password, 10)
    delete user.password
    user.image = `/icon/${user.username}/128`
  }
  await inParallel(data.users, 4, async (user) => {
    await saveFile(`icon/${user.username}/128.png`, await download(`${SOURCE}/icon/${user.username}/128`))
  })
  console.log(`avatars : ${data.users.length}`)

  // Produits : miniatures en local ; galeries en local seulement si leur poids total reste raisonnable
  const gallery = data.products.flatMap((product) => product.images)
  let galleryBytes = 0
  await inParallel(gallery, 8, async (url) => {
    const head = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(15_000) })
    galleryBytes += Number(head.headers.get('content-length') ?? 0)
  })
  const localGallery = galleryBytes < IMAGES_MAX_BYTES
  console.log(`galeries : ${gallery.length} images, ${(galleryBytes / 1024 / 1024).toFixed(1)} Mo, ${localGallery ? 'en local' : 'sur le CDN'}`)

  const toFetch = data.products.map((product) => product.thumbnail)
  if (localGallery) toFetch.push(...gallery)
  await inParallel(toFetch, 8, async (url) => saveFile(toLocal(url), await download(url)))
  for (const product of data.products) {
    product.thumbnail = toLocal(product.thumbnail)
    if (localGallery) product.images = product.images.map(toLocal)
  }
  for (const cart of data.carts) {
    for (const line of cart.products) line.thumbnail = toLocal(line.thumbnail)
  }

  await mkdir(path.join(ROOT, 'data'), { recursive: true })
  for (const [name, items] of Object.entries({ ...data, categories })) {
    await writeFile(path.join(ROOT, 'data', `${name}.json`), `${JSON.stringify(items, null, 2)}\n`)
  }
  console.log('Données écrites dans data/, images dans public/')
}

main().catch((err) => {
  console.error('Import impossible :', err.message)
  process.exitCode = 1
})
