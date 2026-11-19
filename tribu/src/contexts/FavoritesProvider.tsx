import type { ReactNode } from 'react'
import { FavoritesContext } from './FavoritesContext.ts'
import { useLocalStorage } from '../hooks/useLocalStorage.ts'

// Les favoris, gardés au rechargement, mis à disposition de toute l'application
function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useLocalStorage<number[]>('tribu.favoris', [])

  const isFavorite = (id: number) => favorites.includes(id)
  const toggleFavorite = (id: number) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))

  return <FavoritesContext value={{ favorites, isFavorite, toggleFavorite }}>{children}</FavoritesContext>
}

export default FavoritesProvider
