import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Tabs from './Tabs.tsx'

const tabs = ['Profil', 'Tâches', 'Publications']

describe('Tabs', () => {
  it("marque l'onglet actif", () => {
    render(<Tabs tabs={tabs} active="Tâches" onChange={vi.fn()} />)
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    expect(screen.getByRole('tab', { name: 'Tâches' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Profil' })).toHaveAttribute('aria-selected', 'false')
  })

  it("demande au parent d'afficher l'onglet cliqué", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Tabs tabs={tabs} active="Profil" onChange={onChange} />)

    await user.click(screen.getByRole('tab', { name: 'Publications' }))

    expect(onChange).toHaveBeenCalledWith('Publications')
  })
})
