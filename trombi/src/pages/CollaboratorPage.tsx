import { Link, useNavigate, useParams } from "react-router";
import Panel from "../components/Panel.tsx";
import CollaboratorDetail from "../components/CollaboratorDetail.tsx";
import { useAppSelector } from "../store/hooks.ts";

function CollaboratorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const items = useAppSelector((state) => state.collaborators.items);
  const added = useAppSelector((state) => state.collaborators.added);
  const status = useAppSelector((state) => state.collaborators.status);
  const collaborator = [...added, ...items].find((c) => c.id === Number(id));

  if (!collaborator) {
    if (status === "idle" || status === "loading") {
      return <div className="spinner" role="status" aria-label="Chargement" />;
    }
    return (
      <div className="not-found">
        <h2>Collaborateur introuvable</h2>
        <Link to="/annuaire">Revenir à l'annuaire</Link>
      </div>
    );
  }

  return (
    <Panel
      title="Fiche"
      actions={
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => navigate(-1)}
        >
          ← Retour
        </button>
      }
    >
      <CollaboratorDetail key={collaborator.id} collaborator={collaborator} />
    </Panel>
  );
}

export default CollaboratorPage;
