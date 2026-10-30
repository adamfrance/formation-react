// Valide la requête avec des schémas zod ; le résultat est rangé dans req.validated, la première erreur renvoie 400
import { badRequest } from '../utils/httpError.js'

export function validate(schemas) {
  return (req, res, next) => {
    req.validated ??= {}
    for (const [part, schema] of Object.entries(schemas)) {
      const result = schema.safeParse(req[part] ?? {})
      if (!result.success) return next(badRequest(result.error.issues[0].message))
      req.validated[part] = result.data
    }
    next()
  }
}
