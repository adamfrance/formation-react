// Les règles de liste de DummyJSON, communes à toutes les ressources : tri, pagination, sélection des champs
import { getPath } from '../utils/objects.js'

const DEFAULT_LIMIT = 30

// select=firstName,age → { id, firstName, age } (id toujours en tête, champs de premier niveau, dans l'ordre demandé)
export function selectFields(item, select) {
  if (!select || select.length === 0) return item
  const picked = { id: item.id }
  for (const field of select) {
    if (Object.hasOwn(item, field)) picked[field] = item[field]
  }
  return picked
}

// Comparaison des textes comme DummyJSON : sans tenir compte de la casse, et les nombres dans l'ordre (« iPhone 6 » avant « iPhone 12 »)
const collator = new Intl.Collator('en', { numeric: true })

function compare(a, b) {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return collator.compare(String(a ?? ''), String(b ?? ''))
}

// Tri stable : à égalité, l'ordre d'origine est gardé
export function sortItems(items, sortBy, order = 'asc') {
  if (!sortBy) return items
  const direction = order === 'desc' ? -1 : 1
  return [...items].sort((x, y) => direction * compare(x[sortBy], y[sortBy]))
}

// La réponse de liste de DummyJSON : { <ressource>: [...], total, skip, limit } (limit = nombre d'éléments renvoyés)
export function listResponse(name, items, { limit = DEFAULT_LIMIT, skip = 0, select, sortBy, order } = {}) {
  const sorted = sortItems(items, sortBy, order)
  const end = limit === 0 ? undefined : skip + limit
  const page = sorted.slice(skip, end).map((item) => selectFields(item, select))
  return { [name]: page, total: items.length, skip, limit: page.length }
}

// Recherche sans tenir compte de la casse dans les champs donnés ; une recherche vide renvoie tout
export function searchItems(items, q, fields) {
  const needle = (q ?? '').toLowerCase()
  if (!needle) return items
  return items.filter((item) => fields.some((field) => String(item[field] ?? '').toLowerCase().includes(needle)))
}

// Filtre exact sur un chemin pointé (key=hair.color&value=Brown), sensible à la casse
export function filterItems(items, key, value) {
  if (!key) return []
  return items.filter((item) => {
    const found = getPath(item, key)
    return found !== undefined && found !== null && String(found) === value
  })
}
