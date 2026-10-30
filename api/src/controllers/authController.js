// Connexion, profil et rafraîchissement : jetons dans le corps de la réponse et dans des cookies HttpOnly
import { parseCookies } from '../utils/cookies.js'

export function createAuthController(authService, authConfig) {
  const cookieOptions = { httpOnly: true, secure: authConfig.cookieSecure, sameSite: 'lax', path: '/' }

  function setTokenCookies(res, { accessToken, refreshToken }, expiresInMins) {
    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: expiresInMins * 60_000 })
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: authConfig.refreshExpiresInMins * 60_000 })
    res.set('Cache-Control', 'no-store') // une réponse qui contient des jetons ne se garde dans aucun cache
  }

  return {
    async login(req, res) {
      const { username, password, expiresInMins = authConfig.defaultExpiresInMins } = req.validated.body
      const { user, tokens } = await authService.login(username, password, expiresInMins)
      setTokenCookies(res, tokens, expiresInMins)
      const { id, email, firstName, lastName, gender, image } = user
      res.json({ ...tokens, id, username: user.username, email, firstName, lastName, gender, image })
    },

    me(req, res) {
      res.set('Cache-Control', 'no-store')
      res.json(req.user)
    },

    refresh(req, res) {
      const { expiresInMins = authConfig.defaultExpiresInMins } = req.validated.body
      const refreshToken = req.validated.body.refreshToken ?? parseCookies(req.get('cookie')).refreshToken
      if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' })
      const tokens = authService.refresh(refreshToken, expiresInMins)
      setTokenCookies(res, tokens, expiresInMins)
      res.json(tokens)
    },
  }
}
