// Les erreurs, toujours en JSON { message } ; la pile d'appels n'est montrée qu'en développement
import { HttpError } from '../utils/httpError.js'

export function notFoundHandler(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` })
}

export function errorHandler(config) {
  // Express reconnaît un gestionnaire d'erreurs à ses quatre paramètres, même si next ne sert pas
  return (err, req, res, next) => {
    if (err instanceof HttpError) return res.status(err.status).json({ message: err.message })

    // Erreurs de lecture du corps (express.json) : JSON invalide, corps trop gros, encodage inconnu
    if (err.type === 'entity.parse.failed') return res.status(400).json({ message: err.message })
    if (err.type === 'entity.too.large') return res.status(413).json({ message: 'Request body is too large' })
    if (err.status >= 400 && err.status < 500 && err.expose) return res.status(err.status).json({ message: err.message })

    console.error(err)
    const body = { message: 'Internal Server Error' }
    if (config.mode === 'development') body.stack = err.stack
    res.status(500).json(body)
  }
}
