import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import App from './App.tsx'
import ThemeProvider from './contexts/ThemeProvider.tsx'
import FavoritesProvider from './contexts/FavoritesProvider.tsx'
import { store } from './store/index.ts'
import { startMonitoring } from './monitoring.ts'

// Le cache des données du serveur, partagé par toute l'application
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000 } }, // une donnée reste fraîche une minute : pas de nouvel appel
})

startMonitoring()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider>
          <FavoritesProvider>
            {/* BASE_URL : « / » en local, « /tribu/ » (le nom du dépôt) une fois publié sur GitHub Pages */}
            <BrowserRouter basename={import.meta.env.BASE_URL}>
              <App />
            </BrowserRouter>
          </FavoritesProvider>
        </ThemeProvider>
      </Provider>
      <ReactQueryDevtools /> {/* le panneau d'inspection du cache, absent du build de production */}
    </QueryClientProvider>
  </StrictMode>,
)
