import { createContext, useContext } from 'react'

export interface FavoritesContextValue {
  favorites: number[]
  isFavorite: (id: number) => boolean
  toggleFavorite: (id: number) => void
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(null)

// Lire les favoris depuis n'importe quel composant, sans les recevoir en props
export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites doit être utilisé dans un FavoritesProvider')
  return context
}
