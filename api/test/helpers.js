// Une application de test : configuration explicite, secrets tirés au hasard, limite de débit relevée
import { randomBytes } from 'node:crypto'
import { createApp } from '../src/app.js'
import { loadConfig } from '../src/config.js'

export function testConfig(env = {}) {
  return loadConfig({
    NODE_ENV: 'test',
    JWT_SECRET: randomBytes(32).toString('hex'),
    JWT_REFRESH_SECRET: randomBytes(32).toString('hex'),
    RATE_LIMIT_MAX: '100000',
    ...env,
  })
}

export function testApp(env = {}) {
  const config = testConfig(env)
  return { app: createApp(config), config }
}

// Les réponses de DummyJSON, ramenées aux adresses de l'API locale (avatars, miniatures, catégories)
export function localized(value, publicUrl, key) {
  if (typeof value === 'string') {
    if ((key === 'image' || key === 'url') && value.startsWith('https://dummyjson.com/')) {
      return publicUrl + value.slice('https://dummyjson.com'.length)
    }
    if (key === 'thumbnail' && value.startsWith('https://cdn.dummyjson.com/')) {
      return publicUrl + value.slice('https://cdn.dummyjson.com'.length)
    }
    return value
  }
  if (Array.isArray(value)) return value.map((item) => localized(item, publicUrl, key))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, localized(v, publicUrl, k)]))
  }
  return value
}

// Toutes les clés d'un objet, à toute profondeur (pour chercher un champ interdit)
export function allKeys(value, keys = new Set()) {
  if (Array.isArray(value)) value.forEach((item) => allKeys(item, keys))
  else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      keys.add(key)
      allKeys(child, keys)
    }
  }
  return keys
}
