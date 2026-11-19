import { queryOptions, useQuery } from '@tanstack/react-query'
import { API_URL } from './config.ts'
import type { Collaborator, Post, Task } from './types.ts'

// Un GET vers l'API : une réponse en erreur (404, 500…) devient une exception, donc un échec pour React Query
async function get<T>(path: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { signal })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return (await response.json()) as T
}

// Chaque requête réunit, une fois pour toutes, sa clé dans le cache et la fonction qui charge les données
export const collaboratorsQuery = queryOptions({
  queryKey: ['collaborators'],
  queryFn: async ({ signal }) => {
    const fields = 'firstName,lastName,email,phone,image,role,company,address'
    return (await get<{ users: Collaborator[] }>(`/users?limit=0&select=${fields}`, signal)).users
  },
  staleTime: Infinity, // l'annuaire change peu : chargé une fois par visite, comme avec Redux
})

export const tasksQuery = (userId: number) =>
  queryOptions({
    queryKey: ['tasks', userId],
    queryFn: async ({ signal }) => (await get<{ todos: Task[] }>(`/users/${userId}/todos`, signal)).todos,
  })

export const postsQuery = (userId: number) =>
  queryOptions({
    queryKey: ['posts', userId],
    queryFn: async ({ signal }) => (await get<{ posts: Post[] }>(`/users/${userId}/posts`, signal)).posts,
  })

// POST /users/add : DummyJSON simule l'enregistrement et renvoie l'objet créé (rien n'est gardé sur le serveur)
export async function addCollaborator(collaborator: Collaborator) {
  const response = await fetch(`${API_URL}/users/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(collaborator),
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return (await response.json()) as Collaborator
}

// PUT /todos/:id : coche ou décoche une tâche ; le serveur renvoie la tâche modifiée
export async function updateTask(id: number, completed: boolean) {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return (await response.json()) as Task
}

// Les services, triés et sans doublon
const toDepartments = (all: Collaborator[]) => [...new Set(all.map((c) => c.company.department))].sort()

export function useCollaborators() {
  return useQuery(collaboratorsQuery)
}

export function useDepartments() {
  // select : une donnée dérivée du cache, recalculée seulement quand la liste change
  return useQuery({ ...collaboratorsQuery, select: toDepartments }).data ?? []
}
