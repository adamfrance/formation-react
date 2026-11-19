import { setupServer } from 'msw/node'
import { handlers } from './handlers.ts'

// Intercepte les requêtes de fetch dans Node.js et y répond avec les handlers
export const server = setupServer(...handlers)
