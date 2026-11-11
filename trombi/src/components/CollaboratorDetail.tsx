import Avatar from "./Avatar.tsx";
import type { Collaborator, Task } from "../types.ts";
import { useAppDispatch, useAppSelector } from "../store/hooks.ts";
import { memberAdded, TEAM_MAX } from "../store/teamSlice.ts";
import { useQuery } from "@tanstack/react-query";

interface CollaboratorDetailProps {
  collaborator: Collaborator;
}

function CollaboratorDetail({ collaborator }: CollaboratorDetailProps) {
  const {
    id,
    firstName,
    lastName,
    email,
    phone,
    image,
    role,
    company,
    address,
  } = collaborator;
  const fullName = `${firstName} ${lastName}`;
  const { data, isPending, error } = useQuery({
    queryKey: ["tasks", id], // la clé de l'entrée du cache : une par collaborateur
    queryFn: async ({ signal }) => {
      const response = await fetch(`http://localhost:4000/users/${id}/todos`, {
        signal,
      }); // annulée si plus utile
      if (!response.ok) throw new Error(`HTTP ${response.status}`); // une erreur levée : la requête passe en échec
      return (await response.json()) as { todos: Task[] };
    },
  });
  const tasks = data?.todos ?? [];
  const dispatch = useAppDispatch();
  const inTeam = useAppSelector((state) =>
    state.team.members.some((m) => m.id === id),
  ); // lit le store
  const teamFull = useAppSelector(
    (state) => state.team.members.length >= TEAM_MAX,
  );

  return (
    <article className="detail">
      <header className="detail-header">
        <Avatar name={fullName} src={image} size={88} />
        <div>
          <h3>{fullName}</h3>
          <p>{company.title}</p>
          {role !== "user" && (
            <span className="badge">
              {role === "admin" ? "Administrateur" : "Modérateur"}
            </span>
          )}
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
      <dl className="detail-list">
        <dt>Service</dt>
        <dd>{company.department}</dd>
        <dt>E-mail</dt>
        <dd>
          <a href={`mailto:${email}`}>{email}</a>
        </dd>
        {phone && (
          <>
            <dt>Téléphone</dt>
            <dd>{phone}</dd>
          </>
        )}
        {address.city && (
          <>
            <dt>Ville</dt>
            <dd>
              {address.city}, {address.country}
            </dd>
          </>
        )}
      </dl>
      <h4>Ses tâches</h4>
      {isPending && <p className="loading">Chargement des tâches…</p>}
      {error && (
        <p className="error" role="alert">
          Tâches indisponibles ({error.message})
        </p>
      )}
      {!isPending && !error && tasks.length === 0 && (
        <p className="empty">Aucune tâche.</p>
      )}
      <ul className="tasks">
        {tasks.map((t) => (
          <li key={t.id} className={t.completed ? "done" : undefined}>
            {t.todo}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default CollaboratorDetail;
