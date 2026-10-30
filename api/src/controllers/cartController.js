// Les commandes : POST /carts/add et la modification d'un panier, calculées sans rien enregistrer
import { simulateCartUpdate, simulateNewCart } from '../services/cartService.js'
import { findUser } from './resourceController.js'

export function createCartController(store, carts) {
  return {
    add(req, res) {
      const { userId, products } = req.validated.body
      const user = findUser(store, userId)
      res.status(201).json(simulateNewCart(store, { userId: user.id, products }))
    },

    update(req, res) {
      res.json(simulateCartUpdate(store, carts.findOr404(req.params.id), req.validated.body))
    },
  }
}
