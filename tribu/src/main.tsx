import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import ThemeProvider from './contexts/ThemeProvider.tsx'
import FavoritesProvider from './contexts/FavoritesProvider.tsx'
import { store } from './store/index.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <FavoritesProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </FavoritesProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
