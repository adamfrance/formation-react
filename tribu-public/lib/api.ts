import { cacheLife } from 'next/cache'

export interface Collaborator {
  id: number
  firstName: string
  lastName: string
  email: string
  image: string
  role: 'admin' | 'moderator' | 'user'
  company: { department: string; title: string }
}

const API_URL = 'http://localhost:4000'
const FIELDS = 'firstName,lastName,email,image,role,company' // seulement les champs affichés

// Tous les collaborateurs. 'use cache' : le résultat est gardé et partagé par toutes les visites
export async function getCollaborators() {
  'use cache'
  cacheLife('hours') // rechargé en arrière-plan au plus une fois par heure
  const response = await fetch(`${API_URL}/users?limit=0&select=${FIELDS}`)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return ((await response.json()) as { users: Collaborator[] }).users
}

// Un collaborateur, ou null si l'identifiant n'existe pas (DummyJSON répond 404, ou 400 pour « abc »)
export async function getCollaborator(id: string) {
  'use cache'
  cacheLife('hours')
  const response = await fetch(`${API_URL}/users/${id}?select=${FIELDS}`)
  if (response.status === 404 || response.status === 400) return null
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return (await response.json()) as Collaborator
}

export interface Post {
  id: number
  title: string
  views: number
}

// Les publications : sans 'use cache', relues à chaque visite ; delay=1500 fait attendre l'API 1,5 s (pour voir l'effet)
export async function getPosts(id: number) {
  const response = await fetch(`${API_URL}/users/${id}/posts?delay=1500`)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return ((await response.json()) as { posts: Post[] }).posts
}
