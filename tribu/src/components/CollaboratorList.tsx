import CollaboratorCard from './CollaboratorCard.tsx'
import type { Collaborator } from '../types.ts'

interface CollaboratorListProps {
  collaborators: Collaborator[]
  onAddToTeam?: (collaborator: Collaborator) => void
}

// La grille des cartes
function CollaboratorList({ collaborators, onAddToTeam }: CollaboratorListProps) {
  return (
    <ul className="card-grid">
      {collaborators.map((c) => (
        <CollaboratorCard key={c.id} collaborator={c} onAddToTeam={onAddToTeam} />
      ))}
    </ul>
  )
}

export default CollaboratorList
