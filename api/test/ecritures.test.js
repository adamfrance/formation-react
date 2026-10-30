// Les écritures sont simulées : la réponse montre le résultat, mais rien ne change sur le serveur
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { testApp } from './helpers.js'

const { app } = testApp()

describe('écritures simulées', () => {
  it('une tâche modifiée ne l’est pas pour la requête suivante', async () => {
    const before = await request(app).get('/todos/1')
    const updated = await request(app).put('/todos/1').send({ completed: !before.body.completed })
    expect(updated.body.completed).toBe(!before.body.completed)
    const after = await request(app).get('/todos/1')
    expect(after.body).toEqual(before.body)
  })

  it('deux ajouts reçoivent le même identifiant : rien n’est enregistré', async () => {
    const first = await request(app).post('/users/add').send({ firstName: 'Ada' })
    const second = await request(app).post('/users/add').send({ firstName: 'Grace' })
    expect(first.body.id).toBe(209)
    expect(second.body.id).toBe(209)
    expect((await request(app).get('/users/209')).status).toBe(404)
  })

  it('l’identifiant d’un élément modifié ne change pas', async () => {
    const res = await request(app).patch('/posts/1').send({ id: 999, title: 'Nouveau titre' })
    expect(res.body.id).toBe(1)
    expect(res.body.title).toBe('Nouveau titre')
  })

  it('une commande calcule ses totaux depuis le catalogue', async () => {
    const res = await request(app).post('/carts/add').send({ userId: 1, products: [{ id: 1, quantity: 3 }] })
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({ userId: 1, totalProducts: 1, totalQuantity: 3, total: 29.97, discountedTotal: 27 })
  })

  it('refuse une quantité négative', async () => {
    const res = await request(app).post('/carts/add').send({ userId: 1, products: [{ id: 1, quantity: -2 }] })
    expect(res.status).toBe(400)
  })

  it('fusionne un panier existant avec merge', async () => {
    const res = await request(app).put('/carts/1').send({ merge: true, products: [{ id: 1, quantity: 1 }] })
    expect(res.status).toBe(200)
    expect(res.body.products.map((line) => line.id)).toEqual([162, 113, 122, 138, 1])
    expect(res.body.totalQuantity).toBe(13)
  })
})
