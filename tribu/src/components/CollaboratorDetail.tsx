import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Avatar from './Avatar.tsx'
import Tabs from './Tabs.tsx'
import CollaboratorPosts from './CollaboratorPosts.tsx'
import { useFavorites } from '../contexts/FavoritesContext.ts'
import { useAppDispatch, useAppSelector } from '../store/hooks.ts'
import { memberAdded, TEAM_MAX } from '../store/teamSlice.ts'
import { tasksQuery } from '../queries.ts'
import type { Collaborator } from '../types.ts'

interface CollaboratorDetailProps {
  collaborator: Collaborator
}

// La fiche d'un collaborateur, avec ses tâches chargées depuis l'API
function CollaboratorDetail({ collaborator }: CollaboratorDetailProps) {
  const { id, firstName, lastName, email, phone, image, role, company, address } = collaborator
  const fullName = `${firstName} ${lastName}`
  const { data: tasks = [], isPending, error } = useQuery(tasksQuery(id)) // tableau vide tant que rien n'est arrivé
  const [tab, setTab] = useState('Profil') // l'onglet affiché : un état de la fiche
  const { isFavorite, toggleFavorite } = useFavorites()
  const dispatch = useAppDispatch()
  const inTeam = useAppSelector((state) => state.team.members.some((m) => m.id === id)) // lit le store
  const teamFull = useAppSelector((state) => state.team.members.length >= TEAM_MAX)

  return (
    <article className="detail">
      <header className="detail-header">
        <Avatar name={fullName} src={image} size={88} />
        <div>
          <h3>{fullName}</h3>
          <p>{company.title}</p>
          {role !== 'user' && <span className="badge">{role === 'admin' ? 'Administrateur' : 'Modérateur'}</span>}
          <button type="button" className="btn btn-ghost" onClick={() => toggleFavorite(id)} aria-pressed={isFavorite(id)}>
            {isFavorite(id) ? '★ Favori' : '☆ Ajouter aux favoris'}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => dispatch(memberAdded(collaborator))} // envoie l'action au store
            disabled={inTeam || teamFull}
          >
            {inTeam ? "Dans l'équipe" : "Ajouter à l'équipe"}
          </button>
        </div>
      </header>
      <Tabs tabs={['Profil', 'Tâches', 'Publications']} active={tab} onChange={setTab} />
      {tab === 'Profil' && (
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
      )}
      {tab === 'Tâches' && (
        <>
          {isPending && <p className="loading">Chargement des tâches…</p>}
          {error && <p className="error" role="alert">Tâches indisponibles ({error.message})</p>}
          {!isPending && !error && tasks.length === 0 && <p className="empty">Aucune tâche.</p>}
          <ul className="tasks">
            {tasks.map((t) => (
              <li key={t.id} className={t.completed ? 'done' : undefined}>{t.todo}</li>
            ))}
          </ul>
        </>
      )}
      {tab === 'Publications' && <CollaboratorPosts id={id} />}
    </article>
  )
}

export default CollaboratorDetail
