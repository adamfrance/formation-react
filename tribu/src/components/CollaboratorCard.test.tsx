import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import CollaboratorCard from './CollaboratorCard.tsx'
import FavoritesProvider from '../contexts/FavoritesProvider.tsx'
import { sampleCollaborators } from '../data/collaborators.ts'

const emily = sampleCollaborators[0] // les données d'exemple du jour 1 servent aux tests

// La carte contient un Link et lit les favoris dans le contexte : un routeur en mémoire et le fournisseur des favoris
function Wrapper({ children }: { children: ReactNode }) {
  return (
    <MemoryRouter>
      <FavoritesProvider>{children}</FavoritesProvider>
    </MemoryRouter>
  )
}

describe('CollaboratorCard', () => {
  beforeEach(() => localStorage.clear()) // les favoris sont gardés dans localStorage : chaque test repart de zéro

  it('affiche le nom en lien vers la fiche, le poste et le badge', () => {
    render(<CollaboratorCard collaborator={emily} />, { wrapper: Wrapper })
    expect(screen.getByRole('link', { name: 'Emily Johnson' })).toHaveAttribute('href', '/annuaire/1')
    expect(screen.getByText('Sales Manager')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it("ajoute aux favoris au clic sur l'étoile", async () => {
    const user = userEvent.setup() // simule un utilisateur : survol, focus, clic, frappe
    render(<CollaboratorCard collaborator={emily} />, { wrapper: Wrapper })
    const star = screen.getByRole('button', { name: 'Emily Johnson en favori' })
    expect(star).toHaveAttribute('aria-pressed', 'false')

    await user.click(star)

    expect(star).toHaveAttribute('aria-pressed', 'true')
  })
})
