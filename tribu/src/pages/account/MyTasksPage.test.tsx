import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay } from 'msw'
import { http, HttpResponse } from 'msw/http'
import { beforeEach, describe, expect, it } from 'vitest'
import MyTasksPage from './MyTasksPage.tsx'
import { server } from '../../mocks/server.ts'
import { renderWithProviders } from '../../test/renderWithProviders.tsx'
import type { AuthUser } from '../../store/authSlice.ts'
import type { RootState } from '../../store/index.ts'

const emily: AuthUser = {
  id: 1,
  username: 'emilys',
  firstName: 'Emily',
  lastName: 'Johnson',
  email: 'emily.johnson@x.dummyjson.com',
  image: '',
  role: 'admin',
}
// Emily est connectée : l'état de départ du store
const loggedIn: Partial<RootState> = { auth: { user: emily, token: 'jeton', status: 'idle', error: null } }

describe('MyTasksPage', () => {
  beforeEach(() => {
    server.use(
      http.get('http://localhost:4000/users/:id/todos', () =>
        HttpResponse.json({ todos: [{ id: 47, todo: 'Learn Javascript', completed: false, userId: 1 }] }),
      ),
    )
  })

  it('garde la coche quand le serveur accepte', async () => {
    const user = userEvent.setup()
    server.use(http.put('http://localhost:4000/todos/:id', () => HttpResponse.json({ id: 47, completed: true })))
    renderWithProviders(<MyTasksPage />, { preloadedState: loggedIn })

    await user.click(await screen.findByRole('checkbox', { name: 'Learn Javascript' }))

    expect(screen.getByRole('checkbox', { name: 'Learn Javascript' })).toBeChecked()
  })

  it('enlève la coche quand le serveur refuse', async () => {
    const user = userEvent.setup()
    server.use(
      http.put('http://localhost:4000/todos/:id', async () => {
        await delay(200) // le temps de voir la coche optimiste
        return new HttpResponse(null, { status: 500 })
      }),
    )
    renderWithProviders(<MyTasksPage />, { preloadedState: loggedIn })
    const box = await screen.findByRole('checkbox', { name: 'Learn Javascript' })

    await user.click(box)
    expect(box).toBeChecked() // tout de suite, avant la réponse

    expect(await screen.findByRole('alert')).toHaveTextContent('Modification annulée (HTTP 500)')
    expect(box).not.toBeChecked() // la liste d'avant est revenue
  })
})
