import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { Role } from '../types.ts'

export interface AuthUser {
  id: number
  username: string
  firstName: string
  lastName: string
  email: string
  image: string
  role: Role
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  status: 'idle' | 'loading' | 'failed'
  error: string | null
}

export const SESSION_KEY = 'tribu.session' // sessionStorage : effacé à la fermeture de l'onglet

// La session de l'onglet, relue au démarrage
function loadSession(): Pick<AuthState, 'user' | 'token'> {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY)
    return saved ? (JSON.parse(saved) as Pick<AuthState, 'user' | 'token'>) : { user: null, token: null }
  } catch {
    return { user: null, token: null }
  }
}

const initialState: AuthState = { ...loadSession(), status: 'idle', error: null }

// Connexion : on obtient un jeton, puis le profil complet (avec le rôle) grâce à ce jeton
export const login = createAsyncThunk<
  { user: AuthUser; token: string },
  { username: string; password: string },
  { rejectValue: string }
>('auth/login', async ({ username, password }, { rejectWithValue }) => {
  const response = await fetch('http://localhost:4000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, expiresInMins: 120 }), // jeton valable deux heures
  })
  if (!response.ok) return rejectWithValue('Identifiant ou mot de passe incorrect')
  const { accessToken } = (await response.json()) as { accessToken: string }

  const me = await fetch('http://localhost:4000/auth/me', { headers: { Authorization: `Bearer ${accessToken}` } })
  if (!me.ok) return rejectWithValue(`Profil indisponible (HTTP ${me.status})`)
  const { id, firstName, lastName, email, image, role } = (await me.json()) as AuthUser
  return { user: { id, username, firstName, lastName, email, image, role }, token: accessToken }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'idle'
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? action.error.message ?? 'Connexion impossible' // panne réseau : pas de payload
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
