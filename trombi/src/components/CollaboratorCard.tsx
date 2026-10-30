import Avatar from './Avatar.tsx'
import styles from './CollaboratorCard.module.css'
import type { Collaborator } from '../types.ts'

interface CollaboratorCardProps {
  collaborator: Collaborator // le collaborateur à afficher
}

// Une carte de l'annuaire : reçoit un collaborateur et l'affiche
function CollaboratorCard({ collaborator }: CollaboratorCardProps) {
  const { firstName, lastName, image, role, company } = collaborator // déstructuration : on sort les champs utiles
  const fullName = `${firstName} ${lastName}`

  return (
    <li className={styles.card}>
      <Avatar name={fullName} src={image} />
      <div>
        <h3 className={styles.name}>{fullName}</h3>
        <p className={styles.title}>{company.title}</p>
        <p className={styles.department}>{company.department}</p>
        {role === 'admin' && <span className="badge badge-admin">Admin</span>}
      </div>
    </li>
  )
}

export default CollaboratorCard
