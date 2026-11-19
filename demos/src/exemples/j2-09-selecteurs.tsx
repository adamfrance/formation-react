import { useState } from 'react'
import { configureStore, createSelector, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Provider, useDispatch, useSelector } from 'react-redux'

export const titre = 'createSelector : des données dérivées mémoïsées'

interface Personnage {
  id: number
  nom: string
  espece: string
}

const DEPART: Personnage[] = [
  { id: 1, nom: 'Rick Sanchez', espece: 'Human' },
  { id: 2, nom: 'Morty Smith', espece: 'Human' },
  { id: 6, nom: 'Abadango Cluster Princess', espece: 'Alien' },
  { id: 13, nom: 'Alien Googah', espece: 'Alien' },
]

const personnagesSlice = createSlice({
  name: 'personnages',
  initialState: { items: DEPART },
  reducers: {
    personnageAjoute(state, action: PayloadAction<Personnage>) {
      state.items.push(action.payload)
    },
  },
})

const { personnageAjoute } = personnagesSlice.actions
const store = configureStore({ reducer: { personnages: personnagesSlice.reducer } })
type RootState = ReturnType<typeof store.getState>
const useAppSelector = useSelector.withTypes<RootState>()
const useAppDispatch = useDispatch.withTypes<typeof store.dispatch>()

let calculs = 0 // pour l'exemple : combien de fois le calcul a vraiment été fait

// Un sélecteur de base, puis un sélecteur mémoïsé : le calcul n'est refait que si la liste change
const selectItems = (state: RootState) => state.personnages.items
const selectParEspece = createSelector([selectItems], (items) => {
  calculs += 1
  const compte: Record<string, number> = {}
  for (const p of items) {
    compte[p.espece] = (compte[p.espece] ?? 0) + 1
  }
  return compte
})

function Especes() {
  const parEspece = useAppSelector(selectParEspece)
  const dispatch = useAppDispatch()
  const [, setRendus] = useState(0) // un état sans rapport, pour provoquer de nouveaux rendus
  const ajouter = () => dispatch(personnageAjoute({ id: 47, nom: 'Birdperson', espece: 'Bird-Person' }))

  return (
    <div className="boite">
      <p>
        {Object.entries(parEspece)
          .map(([espece, nombre]) => `${espece} : ${nombre}`)
          .join(' · ')}
      </p>
      <button type="button" onClick={() => setRendus((n) => n + 1)}>Réafficher</button>{' '}
      <button type="button" onClick={ajouter}>+ Birdperson</button>
      <p>Calculs faits : {calculs}</p>
    </div>
  )
}

export default function Selecteurs() {
  return (
    <Provider store={store}>
      <Especes />
    </Provider>
  )
}
