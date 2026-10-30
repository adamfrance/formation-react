// Les protections de l'API : limite de débit, CORS, en-têtes, taille du corps, données jamais exposées
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { loadConfig } from '../src/config.js'
import { allKeys, testApp } from './helpers.js'

describe('limite de débit (100 requêtes par 10 s chez DummyJSON, 3 ici)', () => {
  it('répond 429 en JSON au-delà de la limite, avec les en-têtes de DummyJSON', async () => {
    const { app } = testApp({ RATE_LIMIT_MAX: '3' })
    const statuses = []
    let last
    for (let i = 0; i < 4; i += 1) {
      last = await request(app).get('/users/1?select=id')
      statuses.push(last.status)
    }
    expect(statuses).toEqual([200, 200, 200, 429])
    expect(last.body).toEqual({ message: 'Too many requests, please try again later.' })
    expect(last.headers['x-ratelimit-limit']).toBe('3')
    expect(last.headers['x-ratelimit-remaining']).toBe('0')
    expect(Number(last.headers['x-ratelimit-reset'])).toBeGreaterThan(Date.now() / 1000)
  })

  it('compte aussi les avatars, comme DummyJSON, mais pas les images des produits (servies comme par un CDN)', async () => {
    const { app } = testApp({ RATE_LIMIT_MAX: '2' })
    await request(app).get('/icon/emilys/128')
    await request(app).get('/icon/michaelw/128')
    expect((await request(app).get('/icon/sophiab/128')).status).toBe(429)
    const image = await request(app).get('/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp')
    expect(image.status).toBe(200)
  })
})

describe('CORS', () => {
  const { app } = testApp()

  it('autorise les origines de la liste blanche, cookies compris', async () => {
    const res = await request(app).get('/test').set('Origin', 'http://localhost:5173')
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173')
    expect(res.headers['access-control-allow-credentials']).toBe('true')
  })

  it('n’autorise pas une autre origine', async () => {
    const res = await request(app).get('/test').set('Origin', 'https://site-pirate.example')
    expect(res.headers['access-control-allow-origin']).toBeUndefined()
  })

  it('répond à la requête préalable (preflight) d’un PUT JSON', async () => {
    const res = await request(app)
      .options('/todos/1')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'PUT')
      .set('Access-Control-Request-Headers', 'content-type,authorization')
    expect(res.status).toBe(204)
    expect(res.headers['access-control-allow-methods']).toContain('PUT')
  })
})

describe('en-têtes et erreurs', () => {
  const { app } = testApp()

  it('pose les en-têtes de sécurité et cache la technologie du serveur', async () => {
    const res = await request(app).get('/test')
    expect(res.headers['content-security-policy']).toBe("default-src 'none';frame-ancestors 'none'")
    expect(res.headers['x-content-type-options']).toBe('nosniff')
    expect(res.headers['cross-origin-resource-policy']).toBe('cross-origin')
    expect(res.headers['x-powered-by']).toBeUndefined()
  })

  it('refuse un corps de plus de 100 ko (413)', async () => {
    const res = await request(app).post('/users/add').send({ firstName: 'x'.repeat(200_000) })
    expect(res.status).toBe(413)
    expect(res.body).toEqual({ message: 'Request body is too large' })
  })

  it('répond 404 en JSON pour une route inconnue', async () => {
    const res = await request(app).get('/nexiste-pas')
    expect(res.status).toBe(404)
    expect(res.body).toEqual({ message: 'Route not found: GET /nexiste-pas' })
  })

  it('ne renvoie jamais de mot de passe ni d’empreinte', async () => {
    const responses = await Promise.all([
      request(app).get('/users?limit=0'),
      request(app).get('/users/1'),
      request(app).get('/users/search?q=emily'),
      request(app).post('/users/add').send({ firstName: 'Ada', password: 'secret123' }),
      request(app).put('/users/1').send({ password: 'nouveau' }),
      request(app).delete('/users/1'),
    ])
    for (const res of responses) {
      expect(allKeys(res.body)).not.toContain('password')
      expect(allKeys(res.body)).not.toContain('passwordHash')
      expect(JSON.stringify(res.body)).not.toContain('$2b$')
    }
  })

  it('ignore les clés dangereuses d’un corps JSON', async () => {
    const res = await request(app)
      .put('/todos/1')
      .set('Content-Type', 'application/json')
      .send('{"__proto__": {"admin": true}, "completed": true}')
    expect(res.status).toBe(200)
    expect(res.body.admin).toBeUndefined()
    expect({}.admin).toBeUndefined()
  })

  it('refuse un nom d’avatar qui sortirait du dossier des icônes', async () => {
    for (const seed of ['..', '..%2F..%2Fdata', '%2E%2E']) {
      const res = await request(app).get(`/icon/${seed}/128`)
      expect(res.status).toBe(400)
    }
  })
})

describe('configuration', () => {
  it('refuse de démarrer en production sans JWT_SECRET', () => {
    expect(() => loadConfig({ NODE_ENV: 'production' })).toThrow('JWT_SECRET est obligatoire en production')
  })

  it('tire un secret au hasard en développement, avec un avertissement', () => {
    const warnings = []
    const config = loadConfig({ NODE_ENV: 'development' }, { warn: (message) => warnings.push(message) })
    expect(config.auth.accessSecret).toMatch(/^[0-9a-f]{64}$/)
    expect(warnings).toHaveLength(2)
  })
})
