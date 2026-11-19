import { createContext, useContext } from 'react'
import type { Theme } from '../types.ts'

// Ce que le contexte met à disposition de tous les composants
export interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

// 1. Le contexte : null tant qu'aucun fournisseur ne l'a rempli
export const ThemeContext = createContext<ThemeContextValue | null>(null)

// 3. Le hook pour le lire, avec une erreur claire si on a oublié le fournisseur
export function useTheme() {
  const context = useContext(ThemeContext) // la valeur du fournisseur le plus proche au-dessus
  if (!context) throw new Error('useTheme doit être utilisé dans un ThemeProvider')
  return context
}
