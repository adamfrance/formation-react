// Le délai simulé (?delay=) et les avatars (/icon)
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { testApp } from './helpers.js'

const { app } = testApp()

// Le corps d'une image SVG, en texte (supertest garde les images en Buffer)
const svg = async (url) => {
  const res = await request(app).get(url).buffer(true)
  return { res, text: Buffer.from(res.body).toString('utf8') }
}

describe('?delay=', () => {
  it('fait attendre la réponse', async () => {
    const start = Date.now()
    const res = await request(app).get('/users/1?select=id&delay=300')
    expect(res.status).toBe(200)
    expect(Date.now() - start).toBeGreaterThanOrEqual(290)
  })
})

describe('/icon/:seed/:size', () => {
  it('sert l’avatar PNG enregistré', async () => {
    const res = await request(app).get('/icon/emilys/128')
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toBe('image/png')
    expect(res.body.length).toBeGreaterThan(100)
  })

  it('génère une icône SVG pour un nom ou une taille sans fichier', async () => {
    const { res, text } = await svg('/icon/inconnu/64')
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toBe('image/svg+xml; charset=utf-8')
    expect(text).toMatch(/^<svg [^>]*width="64"/)
  })

  it('génère toujours la même icône pour un même nom', async () => {
    const a = await svg('/icon/ada/32?type=svg')
    const b = await svg('/icon/ada/32?type=svg')
    expect(a.text).toContain('<rect')
    expect(a.text).toBe(b.text)
    expect((await svg('/icon/grace/32')).text).not.toBe(a.text)
  })

  it('refuse une taille hors limites', async () => {
    expect((await request(app).get('/icon/emilys/5000')).status).toBe(400)
  })
})
