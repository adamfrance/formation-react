import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { tasksQuery, updateTask } from '../../queries.ts'
import { useAppSelector } from '../../store/hooks.ts'
import type { Task } from '../../types.ts'

// Les tâches de la personne connectée, à cocher
function MyTasksPage() {
  const user = useAppSelector((state) => state.auth.user)
  const query = tasksQuery(user?.id ?? 0) // RequireAuth garantit un utilisateur
  const queryClient = useQueryClient()
  const { data: tasks = [], isPending, error } = useQuery(query)

  // Mise à jour optimiste : la case se coche tout de suite, et revient en arrière si le serveur refuse
  const toggle = useMutation({
    mutationFn: (task: Task) => updateTask(task.id, !task.completed),
    onMutate: async (task) => {
      await queryClient.cancelQueries({ queryKey: query.queryKey }) // un chargement en cours écraserait la coche
      const snapshot = queryClient.getQueryData(query.queryKey) // la liste d'avant, gardée de côté
      queryClient.setQueryData(query.queryKey, (old = []) =>
        old.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)),
      )
      return snapshot // transmis à onError
    },
    onError: (_error, _task, snapshot) => {
      queryClient.setQueryData(query.queryKey, snapshot) // échec : on remet la liste d'avant
    },
    onSuccess: (saved) => {
      // la réponse du serveur fait foi (DummyJSON ne garde rien : pas de rechargement, il effacerait la coche)
      queryClient.setQueryData(query.queryKey, (old = []) =>
        old.map((t) => (t.id === saved.id ? { ...t, ...saved } : t)),
      )
    },
  })

  if (isPending) return <p className="loading">Chargement de vos tâches…</p>
  if (error) return <p className="error" role="alert">Tâches indisponibles ({error.message})</p>
  if (tasks.length === 0) return <p className="empty">Aucune tâche.</p>
  return (
    <>
      {toggle.isError && <p className="error" role="alert">Modification annulée ({toggle.error.message})</p>}
      <ul className="tasks">
        {tasks.map((t) => (
          <li key={t.id} className={t.completed ? 'done' : undefined}>
            <label>
              <input type="checkbox" checked={t.completed} onChange={() => toggle.mutate(t)} />
              {t.todo}
            </label>
          </li>
        ))}
      </ul>
    </>
  )
}

export default MyTasksPage
