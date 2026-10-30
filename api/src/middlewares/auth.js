// Protège une route : le jeton d'accès vient de l'en-tête Authorization (Bearer) ou du cookie accessToken
import { parseCookies } from '../utils/cookies.js'
import { unauthorized } from '../utils/httpError.js'

export function requireAuth(authService) {
  return (req, res, next) => {
    const header = req.get('authorization')
    let token
    if (header !== undefined) {
      const [scheme, value] = header.split(' ')
      if (scheme !== 'Bearer' || !value) return next(unauthorized('Invalid/Expired Token!'))
      token = value
    } else {
      token = parseCookies(req.get('cookie')).accessToken
    }
    if (!token) return next(unauthorized('Access Token is required'))
    req.user = authService.verifyAccessToken(token)
    next()
  }
}
