import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from './index.ts'

// Sélecteurs de base : ils lisent une partie de l'état
const selectItems = (state: RootState) => state.collaborators.items
const selectAdded = (state: RootState) => state.collaborators.added

// Sélecteurs mémoïsés : le calcul ne refait que si les entrées changent, sinon le même tableau est renvoyé
export const selectAllCollaborators = createSelector([selectItems, selectAdded], (items, added) => [
  ...added,
  ...items,
])

export const selectDepartments = createSelector([selectAllCollaborators], (all) =>
  [...new Set(all.map((c) => c.company.department))].sort(),
)

const selectMembers = (state: RootState) => state.team.members

// L'équipe par service : { Engineering: 2, Marketing: 1 }
export const selectTeamByDepartment = createSelector([selectMembers], (members) => {
  const counts: Record<string, number> = {}
  for (const m of members) {
    counts[m.company.department] = (counts[m.company.department] ?? 0) + 1
  }
  return counts
})
