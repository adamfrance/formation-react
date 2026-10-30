// Démarre l'API et l'arrête proprement (Ctrl+C, arrêt du conteneur)
import { existsSync } from 'node:fs'
import path from 'node:path'
import { createApp } from './app.js'
import { loadConfig } from './config.js'

// Un fichier .env, s'il existe, complète l'environnement (il n'est jamais committé)
const envFile = path.join(import.meta.dirname, '..', '.env')
if (existsSync(envFile)) process.loadEnvFile(envFile)

const config = loadConfig()
const app = createApp(config)

const server = app.listen(config.port, config.host, () => {
  console.log(`API de la formation sur ${config.publicUrl} (${config.mode})`)
})

server.on('error', (err) => {
  console.error(err.code === 'EADDRINUSE' ? `Le port ${config.port} est déjà pris : PORT=4001 npm start` : err)
  process.exit(1)
})

function shutdown(signal) {
  console.log(`${signal} reçu : arrêt de l'API`)
  server.close(() => process.exit(0)) // termine les requêtes en cours, refuse les nouvelles
  server.closeIdleConnections()
  setTimeout(() => process.exit(1), 5_000).unref() // filet de sécurité
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
