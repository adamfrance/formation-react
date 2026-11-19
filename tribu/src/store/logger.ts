import { isAction } from '@reduxjs/toolkit'
import type { Middleware } from '@reduxjs/toolkit'

// Un middleware : il voit passer chaque action avant le reducer, comme un guichet sur le chemin
export const logger: Middleware = (store) => (next) => (action) => {
  if (isAction(action)) console.log('[action]', action.type)
  const result = next(action) // l'action continue vers les reducers
  console.log('[état]', store.getState())
  return result
}
