import { useState } from 'react'

// Remonter l'état : la barre de recherche et la liste partagent le texte tapé, gardé par leur parent commun
export const titre = "Remonter l'état : une recherche partagée"

interface Personnage {
  id: number
  name: string
}

const PERSONNAGES: Personnage[] = [
  { id: 1, name: 'Rick Sanchez' },
  { id: 2, name: 'Morty Smith' },
  { id: 3, name: 'Summer Smith' },
  { id: 4, name: 'Beth Smith' },
  { id: 5, name: 'Jerry Smith' },
  { id: 8, name: 'Adjudicator Rick' },
]

interface BarreRechercheProps {
  value: string // le texte, gardé par le parent
  onChange: (value: string) => void // prévient le parent à chaque frappe
}

// L'enfant ne garde rien : il affiche la valeur reçue et remonte ce qu'on tape
function BarreRecherche({ value, onChange }: BarreRechercheProps) {
  return (
    <input
      type="search"
      placeholder="Rechercher un personnage…"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

function Liste({ personnages }: { personnages: Personnage[] }) {
  return (
    <ul>
      {personnages.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  )
}

export default function RemonterEtat() {
  const [recherche, setRecherche] = useState('') // l'état vit dans le parent commun de la barre et de la liste
  const visibles = PERSONNAGES.filter((p) => p.name.toLowerCase().includes(recherche.toLowerCase()))

  return (
    <div className="boite">
      <BarreRecherche value={recherche} onChange={setRecherche} />
      <p>{visibles.length} personnage(s)</p>
      <Liste personnages={visibles} />
    </div>
  )
}
