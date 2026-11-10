import { useEffect, useState } from 'react'

export const titre = "Dépendance et nettoyage : la fiche d'un personnage"

interface Personnage {
  name: string
  species: string
  status: string
  episode: string[]
}

// La fiche se recharge quand id change ; le nettoyage annule la requête précédente
function Fiche({ id }: { id: number }) {
  const [personnage, setPersonnage] = useState<Personnage | null>(null)
  const [erreur, setErreur] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController() // permet d'annuler cette requête
    console.log(`requête : personnage ${id}`)
    fetch(`https://rickandmortyapi.com/api/character/${id}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json() as Promise<Personnage>
      })
      .then((data) => setPersonnage(data))
      .catch((err: Error) => {
        if (controller.signal.aborted) console.log(`annulée : personnage ${id}`) // une annulation n'est pas une erreur
        else setErreur(err.message)
      })
    return () => controller.abort() // nettoyage : avant l'effet suivant et quand la fiche disparaît
  }, [id]) // relancé à chaque changement d'identifiant

  if (erreur) return <p role="alert">Fiche indisponible ({erreur})</p>
  if (!personnage) return <p>Chargement…</p>
  return (
    <p>
      <strong>{personnage.name}</strong> · {personnage.species} · {personnage.status} · {personnage.episode.length} épisodes
    </p>
  )
}

export default function FichePersonnage() {
  const [id, setId] = useState(1)

  return (
    <div className="boite">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => setId(n)} disabled={n === id}>
          Personnage {n}
        </button>
      ))}
      <Fiche key={id} id={id} />
    </div>
  )
}
