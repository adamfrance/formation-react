// Chaque cas de test/cas.js donne le même statut et le même corps que DummyJSON (réponses enregistrées)
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { CASES } from './cas.js'
import recorded from './fixtures/dummyjson.json' with { type: 'json' }
import { localized, testApp } from './helpers.js'

const { app, config } = testApp()
const expectedByName = new Map(recorded.map((entry) => [entry.name, entry]))

describe('mêmes réponses que DummyJSON', () => {
  it.each(CASES.map((c) => [c.name, c]))('%s', async (name, { method = 'GET', url, body, rawBody, ignore = [] }) => {
    const expected = expectedByName.get(name)
    let call = request(app)[method.toLowerCase()](url)
    if (rawBody !== undefined) call = call.set('Content-Type', 'application/json').send(rawBody)
    else if (body !== undefined) call = call.send(body)
    const response = await call

    expect(response.status).toBe(expected.status)
    const actual = structuredClone(response.body)
    const wanted = localized(structuredClone(expected.body), config.publicUrl)
    for (const field of ignore) {
      expect(actual[field]).toEqual(expect.any(String))
      delete actual[field]
      delete wanted[field]
    }
    expect(JSON.stringify(actual)).toBe(JSON.stringify(wanted)) // mêmes champs, mêmes valeurs, dans le même ordre
  })
})
