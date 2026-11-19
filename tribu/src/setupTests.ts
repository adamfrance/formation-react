// Ajoute à expect les vérifications sur le DOM : toBeInTheDocument, toBeDisabled, toHaveValue…
import '@testing-library/jest-dom/vitest'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './mocks/server.ts'

beforeAll(() => server.listen({ onUnhandledFrame: 'error' })) // une requête non prévue fait échouer le test
afterEach(() => server.resetHandlers()) // retire les réponses ajoutées par un test avec server.use
afterAll(() => server.close())
