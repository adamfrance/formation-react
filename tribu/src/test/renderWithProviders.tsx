import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'
import ThemeProvider from '../contexts/ThemeProvider.tsx'
import FavoritesProvider from '../contexts/FavoritesProvider.tsx'
import { makeStore } from '../store/index.ts'
import type { RootState } from '../store/index.ts'

interface Options {
  route?: string // l'adresse de départ
  preloadedState?: Partial<RootState> // l'état de départ du store
}

// Rend un composant entouré de ce que main.tsx fournit à l'application : store, thème, favoris, routeur
export function renderWithProviders(ui: ReactElement, { route = '/', preloadedState }: Options = {}) {
  const store = makeStore(preloadedState) // un store neuf : aucun test ne voit l'état laissé par un autre
  const result = render(
    <Provider store={store}>
      <ThemeProvider>
        <FavoritesProvider>
          <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </FavoritesProvider>
      </ThemeProvider>
    </Provider>,
  )
  return { store, ...result }
}
