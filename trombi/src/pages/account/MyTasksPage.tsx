import { useFetch } from "../../hooks/useFetch.ts";
import { useAppSelector } from "../../store/hooks.ts";
import type { Task } from "../../types.ts";

function MyTasksPage() {
  const user = useAppSelector((state) => state.auth.user);
  const { data, loading, error } = useFetch<{ todos: Task[] }>(
    `http://localhost:4000/users/${user?.id}/todos`,
  );
  const tasks = data?.todos ?? [];

  if (loading) return <p className="loading">Chargement de vos tâches…</p>;
  if (error)
    return (
      <p className="error" role="alert">
        Tâches indisponibles ({error})
      </p>
    );
  if (tasks.length === 0) return <p className="empty">Aucune tâche.</p>;
  return (
    <ul className="tasks">
      {tasks.map((t) => (
        <li key={t.id} className={t.completed ? "done" : undefined}>
          {t.todo}
        </li>
      ))}
    </ul>
  );
}

export default MyTasksPage;
