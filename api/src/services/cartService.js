// Les paniers : lignes et totaux calculés depuis le catalogue, comme DummyJSON (rien n'est enregistré)
import { round2 } from '../utils/objects.js'

// Une ligne de panier ; un produit inconnu est ignoré, comme sur DummyJSON
function cartLine(products, { id, quantity = 1 }) {
  const product = products.findById(id)
  if (!product) return null
  const total = round2(product.price * quantity)
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    quantity,
    total,
    discountPercentage: product.discountPercentage,
    discountedPrice: Math.round(total * (1 - product.discountPercentage / 100)),
    thumbnail: product.thumbnail,
  }
}

function withTotals(id, userId, lines) {
  return {
    id,
    products: lines,
    total: round2(lines.reduce((sum, line) => sum + line.total, 0)),
    discountedTotal: round2(lines.reduce((sum, line) => sum + (line.discountedPrice ?? line.discountedTotal), 0)),
    userId,
    totalProducts: lines.length,
    totalQuantity: lines.reduce((sum, line) => sum + line.quantity, 0),
  }
}

// POST /carts/add
export function simulateNewCart(store, { userId, products }) {
  const lines = products.map((line) => cartLine(store.products, line)).filter(Boolean)
  return withTotals(store.carts.size + 1, userId, lines)
}

// PUT|PATCH /carts/:id : merge garde les lignes existantes et remplace ou ajoute celles du corps
export function simulateCartUpdate(store, cart, { merge = false, products = [] }) {
  const updates = products.map((line) => cartLine(store.products, line)).filter(Boolean)
  const kept = merge ? cart.products.filter((line) => !updates.some((update) => update.id === line.id)) : []
  return withTotals(cart.id, cart.userId, [...kept, ...updates])
}
