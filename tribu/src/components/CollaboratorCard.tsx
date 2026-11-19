import Avatar from './Avatar.tsx'
import { useFavorites } from '../contexts/FavoritesContext.ts'
import styles from './CollaboratorCard.module.css'
import type { Collaborator } from '../types.ts'

interface CollaboratorCardProps {
  collaborator: Collaborator // le collaborateur à afficher
  isSelected?: boolean
  onSelect: (id: number) => void // fonction du parent, appelée au clic sur la carte
}

// Une carte de l'annuaire : reçoit un collaborateur et l'affiche
function CollaboratorCard({ collaborator, isSelected = false, onSelect }: CollaboratorCardProps) {
  const { id, firstName, lastName, image, role, company } = collaborator // on sort les champs utiles
  const { isFavorite, toggleFavorite } = useFavorites() // lu dans le contexte, plus dans les props
  const fullName = `${firstName} ${lastName}`

  return (
    <li className={isSelected ? `${styles.card} ${styles.selected}` : styles.card}>
      <Avatar name={fullName} src={image} />
      <div className={styles.texts}>
        <h3 className={styles.name}>
          <button type="button" className={styles.select} onClick={() => onSelect(id)}>
            {fullName}
          </button>
        </h3>
        <p className={styles.title}>{company.title}</p>
        <p className={styles.department}>{company.department}</p>
        {role === 'admin' && <span className="badge badge-admin">Admin</span>}
      </div>
      <button
        type="button"
        className={styles.favorite}
        onClick={() => toggleFavorite(id)}
        aria-pressed={isFavorite(id)}
        aria-label={`${fullName} en favori`}
      >
        {isFavorite(id) ? '★' : '☆'}
      </button>
    </li>
  )
}

export default CollaboratorCard
