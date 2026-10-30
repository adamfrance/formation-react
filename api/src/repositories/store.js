// Les données de l'API : lues une fois au démarrage dans data/, gelées, puis servies depuis la mémoire
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { deepFreeze, omit } from '../utils/objects.js'

const COLLECTIONS = ['users', 'products', 'todos', 'posts', 'carts', 'comments']
const IMAGE_KEYS = new Set(['image', 'thumbnail', 'images'])
const PRIVATE_USER_KEYS = ['passwordHash']

// Les images enregistrées avec un chemin (« /icon/emilys/128 ») deviennent des adresses complètes de l'API
function withPublicUrls(value, publicUrl, key) {
  if (typeof value === 'string') return IMAGE_KEYS.has(key) && value.startsWith('/') ? publicUrl + value : value
  if (Array.isArray(value)) return value.map((item) => withPublicUrls(item, publicUrl, key))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, withPublicUrls(v, publicUrl, k)]))
  }
  return value
}

// Une collection en lecture seule : la liste, la recherche par identifiant, et le nombre d'éléments
class Collection {
  constructor(items) {
    this.items = items
    this.byId = new Map(items.map((item) => [item.id, item]))
  }

  all() {
    return this.items
  }

  findById(id) {
    return this.byId.get(id) ?? null
  }

  get size() {
    return this.items.length
  }
}

export function createStore({ dataDir, publicUrl }) {
  const read = (name) => JSON.parse(readFileSync(path.join(dataDir, `${name}.json`), 'utf8'))
  const raw = Object.fromEntries(COLLECTIONS.map((name) => [name, withPublicUrls(read(name), publicUrl)]))

  // Les empreintes des mots de passe restent ici : aucune réponse ne passe par cette table
  const credentials = new Map(raw.users.map((user) => [user.username, { id: user.id, passwordHash: user.passwordHash }]))
  const users = raw.users.map((user) => omit(user, PRIVATE_USER_KEYS))

  const store = {
    users: new Collection(deepFreeze(users)),
    products: new Collection(deepFreeze(raw.products)),
    todos: new Collection(deepFreeze(raw.todos)),
    posts: new Collection(deepFreeze(raw.posts)),
    carts: new Collection(deepFreeze(raw.carts)),
    comments: new Collection(deepFreeze(raw.comments)),
    categories: deepFreeze(read('categories')),
    credentialsFor: (username) => credentials.get(username) ?? null,
  }
  return Object.freeze(store)
}
