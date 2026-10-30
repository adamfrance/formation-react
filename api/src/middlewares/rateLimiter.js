// Limite de débit de DummyJSON : 100 requêtes par tranche de 10 secondes et par adresse IP, puis 429
import { rateLimit } from 'express-rate-limit'

// Les en-têtes de DummyJSON (x-ratelimit-limit, -remaining, -reset en secondes depuis 1970), en plus des en-têtes standard
function setLegacyHeaders(res, info) {
  res.setHeader('x-ratelimit-limit', info.limit)
  res.setHeader('x-ratelimit-remaining', Math.max(0, info.remaining))
  if (info.resetTime) res.setHeader('x-ratelimit-reset', Math.ceil(info.resetTime.getTime() / 1000))
}

export function rateLimiter({ windowMs, max }) {
  const limiter = rateLimit({
    windowMs,
    limit: max,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (req, res, next, options) => {
      setLegacyHeaders(res, req.rateLimit)
      res.status(options.statusCode).json({ message: 'Too many requests, please try again later.' })
    },
  })
  return [
    limiter,
    (req, res, next) => {
      setLegacyHeaders(res, req.rateLimit)
      next()
    },
  ]
}
