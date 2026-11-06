// Toutes les routes de l'API
import { Router } from 'express'
import { createAuthController } from '../controllers/authController.js'
import { requireAuth } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import { loginBody, refreshBody } from '../schemas/index.js'
import { createResourceRouter } from './resources.js'

export function createRoutes({ store, config, authService }) {
  const router = Router()
  const resources = createResourceRouter(store, config)
  const auth = createAuthController(authService, config.auth)
  const authenticated = requireAuth(authService)

  router.all('/test', (req, res) => res.json({ status: 'ok', method: req.method }))

  router.post('/auth/login', validate({ body: loginBody }), auth.login)
  router.get('/auth/me', authenticated, auth.me)
  router.post('/auth/refresh', validate({ body: refreshBody }), auth.refresh)
  router.use('/auth', authenticated, resources) // /auth/products… : les mêmes ressources, jeton exigé

  router.use(resources)
  return router
}
