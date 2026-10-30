// Les routes des ressources, dans l'ordre : les chemins fixes (/search, /add…) avant /:id
import { Router } from 'express'
import { createCartController } from '../controllers/cartController.js'
import { createCommentController } from '../controllers/commentController.js'
import { createProductController } from '../controllers/productController.js'
import { createResourceController, RESOURCES } from '../controllers/resourceController.js'
import { validate } from '../middlewares/validate.js'
import {
  cartAddBody, cartUpdateBody, commentAddBody, listQuery, postAddBody, todoAddBody,
} from '../schemas/index.js'

const query = validate({ query: listQuery })

// Les routes communes : liste, ajout, détail, modification, suppression
function crud(router, base, controller, { add = [controller.add], update = [controller.update] } = {}) {
  router.get(base, query, controller.list)
  router.post(`${base}/add`, ...add)
  router.get(`${base}/:id`, query, controller.getById)
  router.put(`${base}/:id`, ...update)
  router.patch(`${base}/:id`, ...update)
  router.delete(`${base}/:id`, controller.remove)
}

export function createResourceRouter(store, config) {
  const router = Router()
  const c = Object.fromEntries(Object.keys(RESOURCES).map((name) => [name, createResourceController(store, name)]))
  const products = createProductController(store, config.publicUrl)
  const carts = createCartController(store, c.carts)
  const comments = createCommentController(store)

  router.get('/users/search', query, c.users.search)
  router.get('/users/filter', query, c.users.filter)
  router.get('/users/:userId/todos', query, c.todos.byUser)
  router.get('/users/:userId/posts', query, c.posts.byUser)
  router.get('/users/:userId/carts', query, c.carts.byUser)
  crud(router, '/users', c.users)

  router.get('/products/search', query, c.products.search)
  router.get('/products/categories', products.categories)
  router.get('/products/category-list', products.categoryList)
  router.get('/products/category/:slug', query, products.byCategory)
  crud(router, '/products', c.products)

  router.get('/todos/user/:userId', query, c.todos.byUser)
  crud(router, '/todos', c.todos, { add: [validate({ body: todoAddBody }), c.todos.add] })

  router.get('/posts/search', query, c.posts.search)
  router.get('/posts/user/:userId', query, c.posts.byUser)
  router.get('/posts/:postId/comments', query, comments.byPost)
  crud(router, '/posts', c.posts, { add: [validate({ body: postAddBody }), c.posts.add] })

  router.get('/carts/user/:userId', query, c.carts.byUser)
  crud(router, '/carts', c.carts, {
    add: [validate({ body: cartAddBody }), carts.add],
    update: [validate({ body: cartUpdateBody }), carts.update],
  })

  router.get('/comments/post/:postId', query, comments.byPost)
  crud(router, '/comments', c.comments, { add: [validate({ body: commentAddBody }), comments.add] })

  return router
}
