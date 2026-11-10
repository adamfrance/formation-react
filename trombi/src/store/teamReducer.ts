import type { Collaborator } from '../types.ts'

export const TEAM_MAX = 8 // règle métier : une équipe projet compte au plus huit personnes

export interface TeamState {
  members: Collaborator[]
}

// Les actions de l'équipe : une forme par action
export type TeamAction =
  | { type: 'team/memberAdded'; payload: Collaborator }
  | { type: 'team/memberRemoved'; payload: number }
  | { type: 'team/teamCleared' }

// Les créateurs d'actions
export const memberAdded = (member: Collaborator): TeamAction => ({ type: 'team/memberAdded', payload: member })
export const memberRemoved = (id: number): TeamAction => ({ type: 'team/memberRemoved', payload: id })
export const teamCleared = (): TeamAction => ({ type: 'team/teamCleared' })

// Le reducer, écrit à la main : pas de doublon, pas plus de TEAM_MAX membres
export function teamReducer(state: TeamState, action: TeamAction): TeamState {
  switch (action.type) {
    case 'team/memberAdded': {
      const alreadyIn = state.members.some((m) => m.id === action.payload.id)
      if (alreadyIn || state.members.length >= TEAM_MAX) return state
      return { members: [...state.members, action.payload] }
    }
    case 'team/memberRemoved':
      return { members: state.members.filter((m) => m.id !== action.payload) }
    case 'team/teamCleared':
      return { members: [] }
    default:
      return state
  }
}
