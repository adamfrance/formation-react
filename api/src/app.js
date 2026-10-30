// Construit l'application Express (sans écouter de port) : les tests l'importent directement
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import path from 'node:path'
import { delay } from './middlewares/delay.js'
import { errorHandler, notFoundHandler } from './middlewares/errors.js'
import { rateLimiter } from './middlewares/rateLimiter.js'
import { requestLogger } from './middlewares/requestLogger.js'
import { createStore } from './repositories/store.js'
import { createRoutes } from './routes/index.js'
import { createAuthService } from './services/authService.js'

export function createApp(config, store = createStore(config)) {
  const app = express()
  const authService = createAuthService(store, config.auth)

  app.disable('x-powered-by')
  app.set('trust proxy', config.trustProxy) // derrière un proxy seulement : sinon req.ip pourrait être falsifiée
  if (config.logRequests) app.use(requestLogger)

  app.use(
    helmet({
      // une API ne sert pas de page : rien ne peut s'exécuter ni s'afficher dans un cadre
      contentSecurityPolicy: { useDefaults: false, directives: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] } },
      crossOriginResourcePolicy: { policy: 'cross-origin' }, // les images sont affichées par d'autres origines
    }),
  )
  app.use(
    cors({
      origin: (origin, callback) => callback(null, !origin || config.corsOrigins.includes(origin)),
      credentials: true,
    }),
  )

  // Les images des produits : servies comme par un CDN, hors limite de débit
  app.use(
    '/product-images',
    express.static(path.join(config.publicDir, 'product-images'), { immutable: true, maxAge: '30d', index: false }),
  )

  app.use(rateLimiter(config.rateLimit))
  app.use(express.json({ limit: config.jsonLimit }))
  app.use(delay)
  app.use(createRoutes({ store, config, authService }))

  app.use(notFoundHandler)
  app.use(errorHandler(config))
  return app
}
