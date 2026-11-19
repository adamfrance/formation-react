import { useState } from 'react'

export const titre = "useState : l'état et le champ contrôlé"

// Quelques personnages de Rick et Morty, écrits dans l'exemple
const PERSONNAGES = ['Rick Sanchez', 'Morty Smith', 'Summer Smith', 'Beth Smith', 'Jerry Smith', 'Birdperson']

export default function Etat() {
  const [aime, setAime] = useState(false) // un état : il survit aux rendus
  const [recherche, setRecherche] = useState('') // le texte du champ

  const texte = recherche.trim().toLowerCase()
  const visibles = PERSONNAGES.filter((p) => p.toLowerCase().includes(texte)) // valeur dérivée, recalculée à chaque rendu

  return (
    <div className="colonnes">
      <div className="boite">
        <h3>Un bouton qui se souvient</h3>
        <button type="button" onClick={() => setAime(!aime)}>
          {aime ? '❤️ Aimé' : '🤍 Aimer'}
        </button>
      </div>
      <div className="boite">
        <h3>Champ contrôlé</h3>
        <input value={recherche} onChange={(event) => setRecherche(event.target.value)} placeholder="Rechercher…" />
        <p>{visibles.length} / {PERSONNAGES.length}</p>
        <ul>
          {visibles.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
