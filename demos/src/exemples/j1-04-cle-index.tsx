import { useState } from 'react'

export const titre = 'Clé : index ou identifiant'

interface Item {
  id: number
  name: string
}

const FIRST: Item[] = [
  { id: 1, name: 'Rick' },
  { id: 2, name: 'Morty' },
]

// Deux listes identiques ; seule la clé change. Tapez un texte dans la ligne de Rick, puis ajoutez en tête.
function Liste({ entete, useIndex }: { entete: string; useIndex: boolean }) {
  const [items, setItems] = useState(FIRST)

  const addFirst = () => setItems((prev) => [{ id: Date.now(), name: 'Nouveau' }, ...prev])

  return (
    <div className="boite">
      <h3>{entete}</h3>
      <button type="button" onClick={addFirst}>Ajouter en tête</button>
      <ul className="lignes">
        {items.map((item, index) => (
          <li key={useIndex ? index : item.id}>
            <strong>{item.name}</strong>
            <input placeholder="Une note…" />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function CleIndex() {
  return (
    <div className="colonnes">
      <Liste entete="key={index}" useIndex />
      <Liste entete="key={item.id}" useIndex={false} />
    </div>
  )
}
