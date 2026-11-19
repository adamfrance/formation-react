import { configureStore } from '@reduxjs/toolkit'
import teamReducer from './teamSlice.ts'
import collaboratorsReducer from './collaboratorsSlice.ts'
import { logger } from './logger.ts'

// Le store : un seul objet pour tout l'état partagé, une clé par tranche
export const store = configureStore({
  reducer: {
    team: teamReducer,
    collaborators: collaboratorsReducer,
  },
  // les middlewares par défaut (dont celui des thunks), plus notre journal en développement
  middleware: (getDefaultMiddleware) =>
    import.meta.env.DEV ? getDefaultMiddleware().concat(logger) : getDefaultMiddleware(),
})

export type RootState = ReturnType<typeof store.getState> // le type de tout l'état, déduit des reducers
export type AppDispatch = typeof store.dispatch
