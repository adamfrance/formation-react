import { useEffect, useState } from 'react'

export const titre = 'useEffect : charger des données'

const ADRESSE = 'https://rickandmortyapi.com/api/character'
const ADRESSE_FAUSSE = 'https://rickandmortyapi.com/api/characterz' // une faute de frappe : l'API répond 404

interface Personnage {
  id: number
  name: string
  species: string
}

// Une liste chargée depuis l'API, avec ses trois états : chargement, succès, erreur
function Liste({ adresse }: { adresse: string }) {
  const [personnages, setPersonnages] = useState<Personnage[]>([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState<string | null>(null)

  useEffect(() => {
    fetch(adresse)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`) // fetch ne rejette pas sur une erreur HTTP
        return response.json() as Promise<{ results: Personnage[] }>
      })
      .then((data) => setPersonnages(data.results.slice(0, 5)))
      .catch((err: Error) => setErreur(err.message))
      .finally(() => setChargement(false))
  }, [adresse]) // l'adresse ne change pas : l'effet s'exécute une fois, après le premier rendu

  return (
    <div className="boite">
      <h3>{adresse.replace('https://rickandmortyapi.com', '')}</h3>
      {chargement && <p>Chargement…</p>}
      {erreur && <p role="alert">Impossible de charger les personnages : {erreur}</p>}
      <ul>
        {personnages.map((p) => (
          <li key={p.id}>{p.name} ({p.species})</li>
        ))}
      </ul>
    </div>
  )
}

export default function Chargement() {
  return (
    <div className="colonnes">
      <Liste adresse={ADRESSE} />
      <Liste adresse={ADRESSE_FAUSSE} />
    </div>
  )
}
