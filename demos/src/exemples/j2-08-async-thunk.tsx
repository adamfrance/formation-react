import { useEffect } from 'react'
import { configureStore, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Provider, useDispatch, useSelector } from 'react-redux'

export const titre = 'createAsyncThunk : charger des données dans le store'

interface Personnage {
  id: number
  name: string
}

interface PersonnagesState {
  items: Personnage[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

let requetes = 0 // pour l'exemple : le nombre d'appels réellement partis vers l'API

// L'action asynchrone : Redux Toolkit envoie « pending », puis « fulfilled » ou « rejected »
const chargerPersonnages = createAsyncThunk<
  Personnage[],
  void,
  { state: { personnages: PersonnagesState }; rejectValue: string }
>(
  'personnages/charger',
  async (_, { rejectWithValue }) => {
    requetes += 1
    try {
      const reponse = await fetch('https://rickandmortyapi.com/api/character?page=1')
      if (!reponse.ok) return rejectWithValue(`HTTP ${reponse.status}`)
      const data = (await reponse.json()) as { results: Personnage[] }
      return data.results // devient action.payload de « fulfilled »
    } catch (err) {
      return rejectWithValue((err as Error).message) // devient action.payload de « rejected »
    }
  },
  {
    // pas de second appel si les données sont déjà là ou en cours de chargement
    condition: (_, { getState }) => ['idle', 'failed'].includes(getState().personnages.status),
  },
)

const initialState: PersonnagesState = { items: [], status: 'idle', error: null }

const personnagesSlice = createSlice({
  name: 'personnages',
  initialState,
  reducers: {},
  // les trois étapes du thunk
  extraReducers: (builder) => {
    builder
      .addCase(chargerPersonnages.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(chargerPersonnages.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(chargerPersonnages.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'erreur inconnue'
      })
  },
})

const store = configureStore({ reducer: { personnages: personnagesSlice.reducer } })
const useAppSelector = useSelector.withTypes<ReturnType<typeof store.getState>>()
const useAppDispatch = useDispatch.withTypes<typeof store.dispatch>()

function Personnages() {
  const dispatch = useAppDispatch()
  const { items, status, error } = useAppSelector((state) => state.personnages)

  useEffect(() => {
    dispatch(chargerPersonnages()) // StrictMode lance cet effet deux fois : condition bloque le second appel
  }, [dispatch])

  return (
    <div className="boite">
      <p>Statut : {status} · requêtes envoyées : {requetes}</p>
      {error && <p role="alert">Erreur : {error}</p>}
      <p>{items.length} personnages : {items.slice(0, 5).map((p) => p.name).join(', ')}…</p>
    </div>
  )
}

export default function AsyncThunk() {
  return (
    <Provider store={store}>
      <Personnages />
    </Provider>
  )
}
