import { describe, expect, it } from 'vitest'
import reducer, { memberAdded, memberRemoved, teamCleared, TEAM_MAX } from './teamSlice.ts'
import { sampleCollaborators } from '../data/collaborators.ts'

const [emily, michael] = sampleCollaborators

// Un reducer est une fonction pure : (état, action) => nouvel état. Pas d'écran, pas de réseau.
describe('teamSlice', () => {
  it('ajoute un membre une seule fois', () => {
    let state = reducer(undefined, memberAdded(emily)) // undefined : on part de l'état initial
    state = reducer(state, memberAdded(emily))
    expect(state.members).toEqual([emily])
  })

  it(`s'arrête à ${TEAM_MAX} membres`, () => {
    let state = reducer(undefined, teamCleared())
    for (const c of sampleCollaborators) state = reducer(state, memberAdded(c)) // 12 tentatives
    expect(state.members).toHaveLength(TEAM_MAX)
  })

  it("retire un membre, puis vide l'équipe", () => {
    let state = reducer(undefined, memberAdded(emily))
    state = reducer(state, memberAdded(michael))
    state = reducer(state, memberRemoved(emily.id))
    expect(state.members).toEqual([michael])
    expect(reducer(state, teamCleared()).members).toEqual([])
  })
})
