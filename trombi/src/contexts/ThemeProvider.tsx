import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { ThemeContext } from './ThemeContext.ts'
import { useLocalStorage } from '../hooks/useLocalStorage.ts'
import type { Theme } from '../types.ts'

// 2. Le fournisseur : il détient l'état du thème et le met dans le contexte
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>('trombi.theme', 'clair') // le choix survit au rechargement

  useEffect(() => {
    document.documentElement.dataset.theme = theme // le DOM suit l'état
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'clair' ? 'sombre' : 'clair'))

  return <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext> // React 19 : plus de .Provider
}

export default ThemeProvider
