import { configureStore } from '@reduxjs/toolkit'
import teamReducer from './teamSlice.ts'
import collaboratorsReducer from './collaboratorsSlice.ts'

// Le store : un seul objet pour tout l'état partagé, une clé par tranche
export const store = configureStore({
  reducer: {
    team: teamReducer,
    collaborators: collaboratorsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState> // le type de tout l'état, déduit des reducers
export type AppDispatch = typeof store.dispatch
