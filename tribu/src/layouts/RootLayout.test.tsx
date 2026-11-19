import { screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw/http'
import { describe, expect, it, vi } from 'vitest'
import App from '../App.tsx'
import { server } from '../mocks/server.ts'
import { renderWithProviders } from '../test/renderWithProviders.tsx'

describe("L'Error Boundary des pages", () => {
  it("garde l'en-tête quand une page plante", async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {}) // React signale l'erreur capturée dans la console
    const log = vi.spyOn(console, 'log').mockImplementation(() => {}) // notre service de suivi écrit dans la console
    // l'API renvoie un collaborateur sans « company » : la fiche plante en lisant company.title
    server.use(
      http.get('http://localhost:4000/users', () =>
        HttpResponse.json({ users: [{ id: 1, firstName: 'Emily', lastName: 'Johnson', role: 'admin' }] }),
      ),
    )
    renderWithProviders(<App />, { route: '/annuaire/1' })

    expect(await screen.findByRole('heading', { name: "Cette page n'a pas pu s'afficher" })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Annuaire' })).toBeInTheDocument() // l'en-tête est toujours là
    expect(log).toHaveBeenCalledWith('[suivi] erreur', "Cannot read properties of undefined (reading 'title')")
  })
})
