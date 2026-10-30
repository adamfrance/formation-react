// Connexion et jetons JWT : mots de passe vérifiés avec bcrypt, jetons signés avec des secrets lus dans l'environnement
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { badRequest, forbidden, HttpError, unauthorized } from '../utils/httpError.js'

// Empreinte d'un mot de passe quelconque : comparée quand l'utilisateur n'existe pas, pour un temps de réponse identique
const DECOY_HASH = '$2b$10$Y7SESQLJZPUPfSvtJPr48e43ia.zJQYuoqzfjZkADe5BUFstpwTtK'

// Le contenu des jetons, celui de DummyJSON
const claims = ({ id, username, email, firstName, lastName, gender, image }) => ({
  id, username, email, firstName, lastName, gender, image,
})

export function createAuthService(store, authConfig) {
  const { accessSecret, refreshSecret, refreshExpiresInMins } = authConfig

  function issueTokens(user, expiresInMins) {
    const accessToken = jwt.sign(claims(user), accessSecret, { algorithm: 'HS256', expiresIn: expiresInMins * 60 })
    const refreshToken = jwt.sign(claims(user), refreshSecret, { algorithm: 'HS256', expiresIn: refreshExpiresInMins * 60 })
    return { accessToken, refreshToken }
  }

  // Même message pour un utilisateur inconnu et un mauvais mot de passe : on ne dit pas quels comptes existent
  async function login(username, password, expiresInMins) {
    const credentials = store.credentialsFor(username)
    const valid = await bcrypt.compare(password, credentials?.passwordHash ?? DECOY_HASH)
    if (!credentials || !valid) throw badRequest('Invalid credentials')
    const user = store.users.findById(credentials.id)
    return { user, tokens: issueTokens(user, expiresInMins) }
  }

  // Jeton d'accès : 401 si absent, expiré ou invalide
  function verifyAccessToken(token) {
    try {
      const payload = jwt.verify(token, accessSecret, { algorithms: ['HS256'] })
      const user = store.users.findById(payload.id)
      if (!user) throw unauthorized('Invalid/Expired Token!')
      return user
    } catch (err) {
      if (err instanceof HttpError) throw err
      if (err instanceof jwt.TokenExpiredError) throw unauthorized('Token Expired!')
      throw unauthorized('Invalid/Expired Token!')
    }
  }

  // Jeton de rafraîchissement : un nouveau couple de jetons, ou 403 s'il est invalide ou expiré
  function refresh(refreshToken, expiresInMins) {
    let payload
    try {
      payload = jwt.verify(refreshToken, refreshSecret, { algorithms: ['HS256'] })
    } catch {
      throw forbidden('Invalid refresh token')
    }
    const user = store.users.findById(payload.id)
    if (!user) throw forbidden('Invalid refresh token')
    return issueTokens(user, expiresInMins)
  }

  return { login, verifyAccessToken, refresh }
}
