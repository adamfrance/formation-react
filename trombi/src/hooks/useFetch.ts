import { useEffect, useState } from 'react'

// Charge une adresse et renvoie { data, loading, error, refetch } : la logique de chargement, écrite une fois
export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0) // incrémenté par refetch pour relancer l'effet

  useEffect(() => {
    const controller = new AbortController()
    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json() as Promise<T>
      })
      .then((json) => {
        setData(json)
        setError(null)
      })
      .catch((err: Error) => {
        if (!controller.signal.aborted) setError(err.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [url, attempt])

  const refetch = () => {
    setLoading(true)
    setAttempt((n) => n + 1)
  }

  return { data, loading, error, refetch }
}
