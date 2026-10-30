// Seul fichier qui lit les variables d'environnement : toute la configuration de l'API, avec ses valeurs par défaut
import { randomBytes } from 'node:crypto'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')

const DEFAULT_ORIGINS = 'http://localhost:5173,http://localhost:5174,http://localhost:4173,http://localhost:3000'

function integer(value, fallback, name) {
  if (value === undefined || value === '') return fallback
  const number = Number(value)
  if (!Number.isInteger(number) || number < 0) throw new Error(`${name} doit être un entier positif (reçu : ${value})`)
  return number
}

// Un secret absent : refus en production ; en développement, un secret aléatoire pour la durée de l'exécution
function secret(env, name, isProduction, warn) {
  if (env[name]) return env[name]
  if (isProduction) throw new Error(`${name} est obligatoire en production`)
  warn(`${name} absent : secret aléatoire pour cette exécution (les jetons ne survivent pas à un redémarrage)`)
  return randomBytes(32).toString('hex')
}

export function loadConfig(env = process.env, { warn = console.warn } = {}) {
  const mode = env.NODE_ENV ?? 'development'
  const isProduction = mode === 'production'
  const port = integer(env.PORT, 4000, 'PORT')

  return Object.freeze({
    mode,
    isProduction,
    port,
    host: env.HOST || '127.0.0.1',
    publicUrl: (env.PUBLIC_URL || `http://localhost:${port}`).replace(/\/+$/, ''),
    corsOrigins: (env.CORS_ORIGINS || DEFAULT_ORIGINS).split(',').map((origin) => origin.trim()).filter(Boolean),
    trustProxy: env.TRUST_PROXY === 'true',
    rateLimit: Object.freeze({
      windowMs: integer(env.RATE_LIMIT_WINDOW_MS, 10_000, 'RATE_LIMIT_WINDOW_MS'),
      max: integer(env.RATE_LIMIT_MAX, 100, 'RATE_LIMIT_MAX'),
    }),
    jsonLimit: env.JSON_LIMIT || '100kb',
    maxDelayMs: 5_000,
    auth: Object.freeze({
      accessSecret: secret(env, 'JWT_SECRET', isProduction, warn),
      refreshSecret: secret(env, 'JWT_REFRESH_SECRET', isProduction, warn),
      defaultExpiresInMins: 60,
      maxExpiresInMins: 43_200, // 30 jours, comme DummyJSON
      refreshExpiresInMins: 43_200,
      cookieSecure: isProduction, // un cookie Secure exige HTTPS, sauf sur localhost
    }),
    logRequests: env.LOG_REQUESTS ? env.LOG_REQUESTS === 'true' : mode !== 'test',
    dataDir: path.join(ROOT, 'data'),
    publicDir: path.join(ROOT, 'public'),
  })
}
