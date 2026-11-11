import Avatar from "./Avatar.tsx";
import { useAppDispatch, useAppSelector } from "../store/hooks.ts";
import { memberRemoved, teamCleared, TEAM_MAX } from "../store/teamSlice.ts";

function TeamPanel() {
  const members = useAppSelector((state) => state.team.members);
  const dispatch = useAppDispatch();

  if (members.length === 0) {
    return (
      <p className="empty">
        Aucun membre : ouvrez une fiche et cliquez « Ajouter à l'équipe ».
      </p>
    );
  }
  return (
    <>
      <ul className="team-list">
        {members.map((m) => (
          <li key={m.id}>
            <Avatar
              name={`${m.firstName} ${m.lastName}`}
              src={m.image}
              size={32}
            />
            <span>
              {m.firstName} {m.lastName}
            </span>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => dispatch(memberRemoved(m.id))}
            >
              Retirer
            </button>
          </li>
        ))}
      </ul>
      <p className="hint">
        {members.length} / {TEAM_MAX} membres
      </p>
      <button
        type="button"
        className="btn"
        onClick={() => dispatch(teamCleared())}
      >
        Vider l'équipe
      </button>
    </>
  );
}

export default TeamPanel;
