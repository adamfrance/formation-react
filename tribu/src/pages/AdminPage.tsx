import { useMutation, useQueryClient } from '@tanstack/react-query'
import Panel from '../components/Panel.tsx'
import NewCollaboratorForm from '../components/NewCollaboratorForm.tsx'
import { addCollaborator, collaboratorsQuery, useDepartments } from '../queries.ts'

// L'administration : proposer un collaborateur est réservé aux administrateurs
function AdminPage() {
  const queryClient = useQueryClient()
  const departments = useDepartments()

  // Une mutation : un appel qui modifie le serveur, avec son état (en cours, échec, succès)
  const mutation = useMutation({
    mutationFn: addCollaborator,
    onSuccess: (created, sent) => {
      // l'objet renvoyé par le serveur va dans la liste en cache ; DummyJSON donne toujours l'id 209 :
      // on garde celui du formulaire, unique
      queryClient.setQueryData(collaboratorsQuery.queryKey, (old = []) => [{ ...created, id: sent.id }, ...old])
    },
  })

  return (
    <Panel title="Proposer un collaborateur">
      {/* mutateAsync renvoie une promesse : le formulaire attend la réponse avant d'annoncer l'ajout */}
      <NewCollaboratorForm departments={departments} onAdd={(c) => mutation.mutateAsync(c)} />
      {mutation.isPending && <p className="loading">Enregistrement…</p>}
      {mutation.isError && <p className="error" role="alert">Enregistrement impossible ({mutation.error.message})</p>}
    </Panel>
  )
}

export default AdminPage
