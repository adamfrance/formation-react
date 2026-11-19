import { screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw/http'
import { describe, expect, it } from 'vitest'
import CollaboratorPosts from './CollaboratorPosts.tsx'
import { server } from '../mocks/server.ts'
import { renderWithProviders } from '../test/renderWithProviders.tsx'

describe('CollaboratorPosts', () => {
  it("affiche les publications renvoyées par l'API", async () => {
    renderWithProviders(<CollaboratorPosts id={1} />)

    expect(screen.getByText('Chargement des publications…')).toBeInTheDocument()
    expect(await screen.findByText('Bienvenue dans Tribu')).toBeInTheDocument() // findBy attend la réponse
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('affiche une erreur quand le serveur répond 500', async () => {
    // pour ce test seulement : la même adresse répond par une erreur
    server.use(http.get('http://localhost:4000/users/:id/posts', () => new HttpResponse(null, { status: 500 })))
    renderWithProviders(<CollaboratorPosts id={1} />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Publications indisponibles (HTTP 500)')
  })

  it('affiche une erreur quand le réseau est coupé', async () => {
    server.use(http.get('http://localhost:4000/users/:id/posts', () => HttpResponse.error())) // échec réseau
    renderWithProviders(<CollaboratorPosts id={1} />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Publications indisponibles (fetch failed)')
  })

  it("annonce qu'il n'y a aucune publication", async () => {
    server.use(http.get('http://localhost:4000/users/:id/posts', () => HttpResponse.json({ posts: [] })))
    renderWithProviders(<CollaboratorPosts id={1} />)

    expect(await screen.findByText('Aucune publication.')).toBeInTheDocument()
  })
})
