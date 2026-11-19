import { combineReducers, configureStore } from '@reduxjs/toolkit'
import teamReducer from './teamSlice.ts'
import collaboratorsReducer from './collaboratorsSlice.ts'
import authReducer, { SESSION_KEY } from './authSlice.ts'
import { logger } from './logger.ts'

// Tout l'état partagé, une clé par tranche
const rootReducer = combineReducers({
  team: teamReducer,
  collaborators: collaboratorsReducer,
  auth: authReducer,
})

export type RootState = ReturnType<typeof rootReducer> // le type de tout l'état, déduit des reducers

// Fabrique un store : un pour l'application, un neuf pour chaque test
export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState, // un état de départ (les tests s'en servent), sinon celui des tranches
    // les middlewares par défaut (dont celui des thunks), plus notre journal avec npm run dev
    middleware: (getDefaultMiddleware) =>
      import.meta.env.MODE === 'development' ? getDefaultMiddleware().concat(logger) : getDefaultMiddleware(),
  })
}

export const store = makeStore() // le store de l'application

// Les reducers restent purs : la session est enregistrée à côté, à chaque changement de l'état
store.subscribe(() => {
  const { user, token } = store.getState().auth
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user, token }))
})

export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = AppStore['dispatch']
