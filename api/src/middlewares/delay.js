// ?delay=1500 : la réponse attend 1,5 s, comme sur DummyJSON (pour voir les chargements) ; 5 s au plus
import { delayQuery } from '../schemas/index.js'
import { badRequest } from '../utils/httpError.js'

export function delay(req, res, next) {
  if (req.query.delay === undefined) return next()
  const result = delayQuery.safeParse({ delay: req.query.delay })
  if (!result.success) return next(badRequest(result.error.issues[0].message))
  const timer = setTimeout(next, result.data.delay)
  res.on('close', () => clearTimeout(timer)) // client parti : on n'attend plus
}
