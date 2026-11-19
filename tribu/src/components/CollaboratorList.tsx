import CollaboratorCard from './CollaboratorCard.tsx'
import type { Collaborator } from '../types.ts'

interface CollaboratorListProps {
  collaborators: Collaborator[]
  selectedId: number | null
  onSelect: (id: number) => void
}

// La grille des cartes
function CollaboratorList({ collaborators, selectedId, onSelect }: CollaboratorListProps) {
  return (
    <ul className="card-grid">
      {collaborators.map((c) => (
        <CollaboratorCard key={c.id} collaborator={c} isSelected={c.id === selectedId} onSelect={onSelect} />
      ))}
    </ul>
  )
}

export default CollaboratorList
