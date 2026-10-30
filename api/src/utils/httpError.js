// Une erreur qui porte son statut HTTP : le gestionnaire d'erreurs la renvoie telle quelle, au format JSON
export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

export const badRequest = (message) => new HttpError(400, message)
export const unauthorized = (message) => new HttpError(401, message)
export const forbidden = (message) => new HttpError(403, message)
export const notFound = (message) => new HttpError(404, message)
