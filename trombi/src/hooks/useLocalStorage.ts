import { useEffect, useState } from 'react'

// Comme useState, mais la valeur survit au rechargement de la page (stockée dans le navigateur)
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key) // lu une seule fois, au premier rendu
      return saved === null ? initialValue : (JSON.parse(saved) as T)
    } catch {
      return initialValue // valeur illisible : on repart de la valeur initiale
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value)) // réécrite à chaque changement
  }, [key, value])

  return [value, setValue] as const // un couple [valeur, fonction], comme useState
}
