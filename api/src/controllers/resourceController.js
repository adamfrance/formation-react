// Les actions communes à toutes les ressources (liste, recherche, détail, écritures simulées), paramétrées par ressource
import { filterItems, listResponse, searchItems, selectFields } from '../services/listService.js'
import { simulateAdd, simulateDelete, simulateUpdate } from '../services/writeService.js'
import { badRequest, notFound } from '../utils/httpError.js'

// Ce qui distingue les ressources : le nom au singulier (messages d'erreur) et les champs de recherche
export const RESOURCES = {
  users: { label: 'User', searchFields: ['firstName', 'lastName', 'username', 'email'] },
  products: { label: 'Product', searchFields: ['title', 'description'] },
  todos: { label: 'Todo' },
  posts: { label: 'Post', searchFields: ['body'] },
  carts: { label: 'Cart' },
  comments: { label: 'Comment' },
}

// Un utilisateur désigné dans l'adresse : 400 si l'identifiant n'est pas un nombre, 404 s'il n'existe pas (règles de DummyJSON)
export function findUser(store, rawId) {
  if (Number.isNaN(Number(rawId))) throw badRequest(`Invalid user id '${rawId}'`)
  const user = store.users.findById(Number(rawId))
  if (!user) throw notFound(`User with id '${rawId}' not found`)
  return user
}

export function createResourceController(store, resource) {
  const collection = store[resource]
  const { label, searchFields = [] } = RESOURCES[resource]

  const findOr404 = (rawId) => {
    if (resource === 'users') return findUser(store, rawId)
    const item = collection.findById(Number(rawId))
    if (!item) throw notFound(`${label} with id '${rawId}' not found`)
    return item
  }

  return {
    list(req, res) {
      res.json(listResponse(resource, collection.all(), req.validated.query))
    },

    search(req, res) {
      const query = req.validated.query
      res.json(listResponse(resource, searchItems(collection.all(), query.q, searchFields), query))
    },

    filter(req, res) {
      const query = req.validated.query
      res.json(listResponse(resource, filterItems(collection.all(), query.key, query.value), query))
    },

    getById(req, res) {
      res.json(selectFields(findOr404(req.params.id), req.validated.query.select))
    },

    // Les éléments d'un utilisateur (/users/:id/todos, /todos/user/:id) ; comme sur DummyJSON, sortBy n'y joue pas
    byUser(req, res) {
      const user = findUser(store, req.params.userId)
      const items = collection.all().filter((item) => item.userId === user.id)
      res.json(listResponse(resource, items, { ...req.validated.query, sortBy: undefined }))
    },

    add(req, res) {
      res.status(201).json(simulateAdd(resource, collection, req.body))
    },

    update(req, res) {
      res.json(simulateUpdate(findOr404(req.params.id), req.body))
    },

    remove(req, res) {
      res.json(simulateDelete(findOr404(req.params.id)))
    },

    findOr404,
  }
}
