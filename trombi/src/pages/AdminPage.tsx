import Panel from "../components/Panel.tsx";
import NewCollaboratorForm from "../components/NewCollaboratorForm.tsx";
import { useAppDispatch, useAppSelector } from "../store/hooks.ts";
import { collaboratorAdded } from "../store/collaboratorsSlice.ts";

function AdminPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.collaborators.items);
  const departments = [
    ...new Set(items.map((c) => c.company.department)),
  ].sort();

  return (
    <Panel title="Proposer un collaborateur">
      <NewCollaboratorForm
        departments={departments}
        onAdd={(c) => dispatch(collaboratorAdded(c))}
      />
    </Panel>
  );
}

export default AdminPage;
