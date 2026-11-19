import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from './index.ts'

const selectMembers = (state: RootState) => state.team.members

// L'équipe par service : { Engineering: 2, Marketing: 1 }
export const selectTeamByDepartment = createSelector([selectMembers], (members) => {
  const counts: Record<string, number> = {}
  for (const m of members) {
    counts[m.company.department] = (counts[m.company.department] ?? 0) + 1
  }
  return counts
})
