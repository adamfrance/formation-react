import { useEffect, useState } from 'react'

export const titre = 'Hook personnalisé : useFetch'

// La logique de chargement, écrite une fois : { data, loading, error }
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json() as Promise<T>
      })
      .then((json) => setData(json))
      .catch((err: Error) => {
        if (!controller.signal.aborted) setError(err.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [url])

  return { data, loading, error }
}

interface Episode {
  id: number
  episode: string
  name: string
}

// Deux composants, deux adresses, le même hook : chacun ne garde que ce qui lui est propre
function Episodes() {
  const { data, loading, error } = useFetch<{ results: Episode[] }>('https://rickandmortyapi.com/api/episode')
  if (loading) return <p>Chargement des épisodes…</p>
  if (error) return <p role="alert">Épisodes indisponibles ({error})</p>
  return (
    <ul>
      {data?.results.slice(0, 5).map((e) => (
        <li key={e.id}>{e.episode} · {e.name}</li>
      ))}
    </ul>
  )
}

function Personnage({ id }: { id: number }) {
  const { data, loading, error } = useFetch<{ name: string; status: string }>(`https://rickandmortyapi.com/api/character/${id}`)
  if (loading) return <p>Chargement…</p>
  if (error) return <p role="alert">Personnage indisponible ({error})</p>
  return <p><strong>{data?.name}</strong> ({data?.status})</p>
}

export default function UseFetch() {
  return (
    <div className="colonnes">
      <div className="boite">
        <h3>Épisodes</h3>
        <Episodes />
      </div>
      <div className="boite">
        <h3>Personnages 1 et 2</h3>
        <Personnage id={1} />
        <Personnage id={2} />
      </div>
    </div>
  )
}
