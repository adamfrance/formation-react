import Avatar from './Avatar.tsx'
import styles from './CollaboratorCard.module.css'
import type { Collaborator } from '../types.ts'

interface CollaboratorCardProps {
  collaborator: Collaborator // le collaborateur à afficher
  isFavorite?: boolean // facultatif : faux par défaut
  onToggleFavorite: (id: number) => void // fonction du parent, appelée au clic sur l'étoile
}

// Une carte de l'annuaire : reçoit un collaborateur et l'affiche
function CollaboratorCard({ collaborator, isFavorite = false, onToggleFavorite }: CollaboratorCardProps) {
  const { id, firstName, lastName, image, role, company } = collaborator // on sort les champs utiles
  const fullName = `${firstName} ${lastName}`

  return (
    <li className={styles.card}>
      <Avatar name={fullName} src={image} />
      <div className={styles.texts}>
        <h3 className={styles.name}>{fullName}</h3>
        <p className={styles.title}>{company.title}</p>
        <p className={styles.department}>{company.department}</p>
        {role === 'admin' && <span className="badge badge-admin">Admin</span>}
      </div>
      <button
        type="button"
        className={styles.favorite}
        onClick={() => onToggleFavorite(id)}
        aria-pressed={isFavorite}
        aria-label={`${fullName} en favori`}
      >
        {isFavorite ? '★' : '☆'}
      </button>
    </li>
  )
}

export default CollaboratorCard
