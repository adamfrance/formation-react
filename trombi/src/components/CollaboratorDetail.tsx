import Avatar from './Avatar.tsx'
import { useFetch } from '../hooks/useFetch.ts'
import type { Collaborator, Task } from '../types.ts'

interface CollaboratorDetailProps {
  collaborator: Collaborator
}

// La fiche d'un collaborateur, avec ses tâches chargées depuis l'API
function CollaboratorDetail({ collaborator }: CollaboratorDetailProps) {
  const { id, firstName, lastName, email, phone, image, role, company, address } = collaborator
  const fullName = `${firstName} ${lastName}`
  const { data, loading, error } = useFetch<{ todos: Task[] }>(`http://localhost:4000/users/${id}/todos`)
  const tasks = data?.todos ?? [] // tableau vide tant que rien n'est arrivé

  return (
    <article className="detail">
      <header className="detail-header">
        <Avatar name={fullName} src={image} size={88} />
        <div>
          <h3>{fullName}</h3>
          <p>{company.title}</p>
          {role !== 'user' && <span className="badge">{role === 'admin' ? 'Administrateur' : 'Modérateur'}</span>}
        </div>
      </header>
      <dl className="detail-list">
        <dt>Service</dt>
        <dd>{company.department}</dd>
        <dt>E-mail</dt>
        <dd><a href={`mailto:${email}`}>{email}</a></dd>
        {phone && (
          <>
            <dt>Téléphone</dt>
            <dd>{phone}</dd>
          </>
        )}
        {address.city && (
          <>
            <dt>Ville</dt>
            <dd>{address.city}, {address.country}</dd>
          </>
        )}
      </dl>
      <h4>Ses tâches</h4>
      {loading && <p className="loading">Chargement des tâches…</p>}
      {error && <p className="error" role="alert">Tâches indisponibles ({error})</p>}
      {!loading && !error && tasks.length === 0 && <p className="empty">Aucune tâche.</p>}
      <ul className="tasks">
        {tasks.map((t) => (
          <li key={t.id} className={t.completed ? 'done' : undefined}>{t.todo}</li>
        ))}
      </ul>
    </article>
  )
}

export default CollaboratorDetail
