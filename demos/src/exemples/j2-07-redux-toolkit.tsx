import { configureStore, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Provider, useDispatch, useSelector } from 'react-redux'

export const titre = 'Redux Toolkit : createSlice et configureStore'

interface Membre {
  id: number
  nom: string
}

const MAX = 3 // la règle de l'exemple : trois personnages au plus

// Une tranche : l'état, les reducers qui le modifient, et les créateurs d'actions générés
const equipeSlice = createSlice({
  name: 'equipe',
  initialState: { membres: [] as Membre[] },
  reducers: {
    membreAjoute(state, action: PayloadAction<Membre>) {
      const dejaLa = state.membres.some((m) => m.id === action.payload.id)
      if (!dejaLa && state.membres.length < MAX) {
        state.membres.push(action.payload) // on « modifie » : Immer fabrique un nouvel état
      }
    },
    equipeVidee(state) {
      state.membres = []
    },
  },
})

const { membreAjoute, equipeVidee } = equipeSlice.actions

// Le store de l'exemple, et ses deux hooks typés
const store = configureStore({ reducer: { equipe: equipeSlice.reducer } })
type RootState = ReturnType<typeof store.getState>
const useAppSelector = useSelector.withTypes<RootState>()
const useAppDispatch = useDispatch.withTypes<typeof store.dispatch>()

const PERSONNAGES: Membre[] = [
  { id: 1, nom: 'Rick Sanchez' },
  { id: 2, nom: 'Morty Smith' },
  { id: 3, nom: 'Summer Smith' },
  { id: 4, nom: 'Beth Smith' },
]

function Equipe() {
  const membres = useAppSelector((state) => state.equipe.membres) // lit le store
  const dispatch = useAppDispatch()

  return (
    <div className="boite">
      {PERSONNAGES.map((p) => (
        <button key={p.id} type="button" onClick={() => dispatch(membreAjoute(p))}>+ {p.nom}</button>
      ))}{' '}
      <button type="button" onClick={() => dispatch(equipeVidee())}>Vider</button>
      <p>{membres.length} / {MAX} : {membres.map((m) => m.nom).join(', ')}</p>
      <p>Type de l'action envoyée par « + » : {membreAjoute.type}</p>
    </div>
  )
}

export default function ReduxToolkit() {
  return (
    <Provider store={store}>
      <Equipe />
    </Provider>
  )
}
