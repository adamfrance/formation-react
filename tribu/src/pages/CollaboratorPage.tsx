import { Link, useNavigate, useParams } from 'react-router'
import Panel from '../components/Panel.tsx'
import CollaboratorDetail from '../components/CollaboratorDetail.tsx'
import { useCollaborators } from '../queries.ts'

// La fiche d'un collaborateur, à l'adresse /annuaire/:id
function CollaboratorPage() {
  const { id } = useParams() // le segment variable de l'adresse : toujours une chaîne
  const navigate = useNavigate()
  const { data: collaborators = [], isPending } = useCollaborators() // déjà en cache si l'on vient de l'annuaire
  const collaborator = collaborators.find((c) => c.id === Number(id))

  if (!collaborator) {
    if (isPending) {
      return <div className="spinner" role="status" aria-label="Chargement" /> // adresse ouverte directement : on attend
    }
    return (
      <div className="not-found">
        <h2>Collaborateur introuvable</h2>
        <Link to="/annuaire">Revenir à l'annuaire</Link>
      </div>
    )
  }

  return (
    <Panel
      title="Fiche"
      actions={<button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>← Retour</button>}
    >
      <CollaboratorDetail key={collaborator.id} collaborator={collaborator} />
    </Panel>
  )
}

export default CollaboratorPage
