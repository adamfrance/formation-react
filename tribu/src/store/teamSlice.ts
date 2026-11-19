import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Collaborator } from '../types.ts'

export const TEAM_MAX = 8 // règle métier : une équipe projet compte au plus huit personnes

interface TeamState {
  members: Collaborator[]
}

const initialState: TeamState = { members: [] }

// Une « tranche » du store : l'état de l'équipe et les actions qui le modifient
const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    memberAdded(state, action: PayloadAction<Collaborator>) {
      const alreadyIn = state.members.some((m) => m.id === action.payload.id)
      if (!alreadyIn && state.members.length < TEAM_MAX) {
        state.members.push(action.payload) // on « modifie » : Immer fabrique un nouvel état
      }
    },
    memberRemoved(state, action: PayloadAction<number>) {
      state.members = state.members.filter((m) => m.id !== action.payload)
    },
    teamCleared(state) {
      state.members = []
    },
  },
})

export const { memberAdded, memberRemoved, teamCleared } = teamSlice.actions // les créateurs d'actions, générés
export default teamSlice.reducer
