import { useReducer } from 'react'

export const titre = 'Un reducer écrit à la main'

interface Membre {
  id: number
  nom: string
}

interface EquipeState {
  membres: Membre[]
}

// Les actions : des objets qui décrivent ce qui s'est passé
type EquipeAction =
  | { type: 'equipe/membreAjoute'; payload: Membre }
  | { type: 'equipe/membreRetire'; payload: number }
  | { type: 'equipe/videe' }

// Les créateurs d'actions : de petites fonctions qui fabriquent ces objets
const membreAjoute = (membre: Membre): EquipeAction => ({ type: 'equipe/membreAjoute', payload: membre })
const membreRetire = (id: number): EquipeAction => ({ type: 'equipe/membreRetire', payload: id })
const videe = (): EquipeAction => ({ type: 'equipe/videe' })

// Le reducer : une fonction pure (état, action) → nouvel état ; il ne modifie jamais l'état reçu
function equipeReducer(state: EquipeState, action: EquipeAction): EquipeState {
  switch (action.type) {
    case 'equipe/membreAjoute':
      if (state.membres.some((m) => m.id === action.payload.id)) return state // pas de doublon
      return { membres: [...state.membres, action.payload] }
    case 'equipe/membreRetire':
      return { membres: state.membres.filter((m) => m.id !== action.payload) }
    case 'equipe/videe':
      return { membres: [] }
    default:
      return state
  }
}

const PERSONNAGES: Membre[] = [
  { id: 1, nom: 'Rick Sanchez' },
  { id: 2, nom: 'Morty Smith' },
  { id: 3, nom: 'Summer Smith' },
]

export default function ReducteurMain() {
  const [state, dispatch] = useReducer(equipeReducer, { membres: [] })

  return (
    <div className="boite">
      {PERSONNAGES.map((p) => (
        <button key={p.id} type="button" onClick={() => dispatch(membreAjoute(p))}>+ {p.nom}</button>
      ))}{' '}
      <button type="button" onClick={() => dispatch(videe())}>Vider</button>
      <ul className="lignes">
        {state.membres.map((m) => (
          <li key={m.id}>
            {m.nom} <button type="button" onClick={() => dispatch(membreRetire(m.id))}>retirer</button>
          </li>
        ))}
      </ul>
      <pre>{JSON.stringify(state)}</pre>
    </div>
  )
}
