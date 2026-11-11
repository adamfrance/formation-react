import { combineReducers, configureStore } from "@reduxjs/toolkit";
import teamReducer from "./teamSlice.ts";
import collaboratorsReducer from "./collaboratorsSlice.ts";
import authReducer, { SESSION_KEY } from "./authSlice.ts";

const rootReducer = combineReducers({
  team: teamReducer,
  collaborators: collaboratorsReducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export const store = makeStore();

store.subscribe(() => {
  const { user, token } = store.getState().auth;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user, token }));
});

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
