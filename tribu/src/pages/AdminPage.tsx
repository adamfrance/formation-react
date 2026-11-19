import Panel from '../components/Panel.tsx'
import NewCollaboratorForm from '../components/NewCollaboratorForm.tsx'
import { useAppDispatch, useAppSelector } from '../store/hooks.ts'
import { collaboratorAdded } from '../store/collaboratorsSlice.ts'
import { selectDepartments } from '../store/selectors.ts'

// L'administration : proposer un collaborateur est réservé aux administrateurs
function AdminPage() {
  const dispatch = useAppDispatch()
  const departments = useAppSelector(selectDepartments)

  return (
    <Panel title="Proposer un collaborateur">
      <NewCollaboratorForm departments={departments} onAdd={(c) => dispatch(collaboratorAdded(c))} />
    </Panel>
  )
}

export default AdminPage
