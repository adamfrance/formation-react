// Les catégories de produits
import { listResponse } from '../services/listService.js'

export function createProductController(store, publicUrl) {
  return {
    categories(req, res) {
      res.json(store.categories.map(({ slug, name }) => ({ slug, name, url: `${publicUrl}/products/category/${slug}` })))
    },

    categoryList(req, res) {
      res.json(store.categories.map(({ slug }) => slug))
    },

    byCategory(req, res) {
      const items = store.products.all().filter((product) => product.category === req.params.slug)
      res.json(listResponse('products', items, req.validated.query))
    },
  }
}
