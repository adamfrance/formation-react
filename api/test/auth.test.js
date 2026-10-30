// Connexion, profil, expiration et rafraîchissement des jetons
import jwt from 'jsonwebtoken'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { allKeys, testApp } from './helpers.js'

const { app, config } = testApp()
const login = (body = { username: 'emilys', password: 'emilyspass' }) => request(app).post('/auth/login').send(body)

describe('POST /auth/login', () => {
  it('renvoie les jetons et le profil, et pose deux cookies HttpOnly', async () => {
    const res = await login({ username: 'emilys', password: 'emilyspass', expiresInMins: 120 })
    expect(res.status).toBe(200)
    expect(Object.keys(res.body)).toEqual([
      'accessToken', 'refreshToken', 'id', 'username', 'email', 'firstName', 'lastName', 'gender', 'image',
    ])
    const payload = jwt.verify(res.body.accessToken, config.auth.accessSecret)
    expect(payload).toMatchObject({ id: 1, username: 'emilys', firstName: 'Emily' })
    expect(payload.exp - payload.iat).toBe(120 * 60)
    const cookies = res.headers['set-cookie'].join('\n')
    expect(cookies).toMatch(/accessToken=[^;]+; Max-Age=7200; Path=\/; Expires=[^;]+; HttpOnly; SameSite=Lax/)
    expect(cookies).toMatch(/refreshToken=[^;]+; Max-Age=2592000; Path=\/; Expires=[^;]+; HttpOnly; SameSite=Lax/)
    expect(res.headers['cache-control']).toBe('no-store')
  })

  it('refuse une durée de validité de plus de 30 jours', async () => {
    const res = await login({ username: 'emilys', password: 'emilyspass', expiresInMins: 50_000 })
    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Maximum access token expire time can be 43200 minutes')
  })

  it('refuse une durée de validité qui n’est pas un nombre', async () => {
    const res = await login({ username: 'emilys', password: 'emilyspass', expiresInMins: 'abc' })
    expect(res.status).toBe(400)
  })

  it('répond pareil, en temps comparable, pour un compte inconnu et un mauvais mot de passe', async () => {
    const t0 = Date.now()
    const unknown = await login({ username: 'personne', password: 'x' })
    const t1 = Date.now()
    const wrong = await login({ username: 'emilys', password: 'x' })
    const t2 = Date.now()
    expect(unknown.status).toBe(400)
    expect(unknown.body).toEqual(wrong.body)
    expect(t1 - t0).toBeGreaterThan(20) // bcrypt a bien tourné, même sans compte
    expect(t2 - t1).toBeGreaterThan(20)
  })
})

describe('GET /auth/me', () => {
  it('renvoie le profil complet, sans mot de passe ni empreinte, avec le jeton en en-tête', async () => {
    const { body } = await login()
    const res = await request(app).get('/auth/me').set('Authorization', `Bearer ${body.accessToken}`)
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ id: 1, username: 'emilys', role: 'admin' })
    expect(allKeys(res.body)).not.toContain('password')
    expect(allKeys(res.body)).not.toContain('passwordHash')
  })

  it('accepte aussi le jeton dans le cookie', async () => {
    const { body } = await login()
    const res = await request(app).get('/auth/me').set('Cookie', `accessToken=${body.accessToken}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(1)
  })

  it('refuse un jeton expiré', async () => {
    const expired = jwt.sign({ id: 1, username: 'emilys' }, config.auth.accessSecret, { expiresIn: -10 })
    const res = await request(app).get('/auth/me').set('Authorization', `Bearer ${expired}`)
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Token Expired!')
  })

  it('refuse un jeton signé avec un autre secret, ou mal formé', async () => {
    const forged = jwt.sign({ id: 1 }, 'un-autre-secret')
    for (const token of [forged, 'abc.def.ghi']) {
      const res = await request(app).get('/auth/me').set('Authorization', `Bearer ${token}`)
      expect(res.status).toBe(401)
      expect(res.body.message).toBe('Invalid/Expired Token!')
    }
  })

  it('refuse un jeton de rafraîchissement utilisé comme jeton d’accès', async () => {
    const { body } = await login()
    const res = await request(app).get('/auth/me').set('Authorization', `Bearer ${body.refreshToken}`)
    expect(res.status).toBe(401)
  })

  it('refuse un en-tête Authorization qui n’est pas « Bearer »', async () => {
    const res = await request(app).get('/auth/me').set('Authorization', 'Basic xyz')
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid/Expired Token!')
  })
})

describe('POST /auth/refresh', () => {
  it('donne un nouveau couple de jetons à partir du jeton de rafraîchissement (corps ou cookie)', async () => {
    const { body } = await login()
    const fromBody = await request(app).post('/auth/refresh').send({ refreshToken: body.refreshToken, expiresInMins: 5 })
    expect(fromBody.status).toBe(200)
    expect(Object.keys(fromBody.body)).toEqual(['accessToken', 'refreshToken'])
    const me = await request(app).get('/auth/me').set('Authorization', `Bearer ${fromBody.body.accessToken}`)
    expect(me.status).toBe(200)

    const fromCookie = await request(app).post('/auth/refresh').set('Cookie', `refreshToken=${body.refreshToken}`).send({})
    expect(fromCookie.status).toBe(200)
  })

  it('refuse un jeton d’accès à la place du jeton de rafraîchissement', async () => {
    const { body } = await login()
    const res = await request(app).post('/auth/refresh').send({ refreshToken: body.accessToken })
    expect(res.status).toBe(403)
    expect(res.body.message).toBe('Invalid refresh token')
  })
})

describe('/auth/<ressource>', () => {
  it('sert les mêmes ressources, jeton exigé', async () => {
    const { body } = await login()
    const res = await request(app).get('/auth/products/1?select=title').set('Authorization', `Bearer ${body.accessToken}`)
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 1, title: 'Essence Mascara Lash Princess' })
  })
})
