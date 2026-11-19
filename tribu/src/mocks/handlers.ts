import { http, HttpResponse } from 'msw/http'
import { sampleCollaborators } from '../data/collaborators.ts'
import type { Post } from '../types.ts'

const posts: Post[] = [
  { id: 1, title: 'Bienvenue dans Tribu', body: "L'annuaire est en ligne.", views: 120 },
  { id: 2, title: 'Nouvelle équipe produit', body: 'Six personnes nous rejoignent.', views: 45 },
]

// La fausse API des tests : mêmes adresses et même forme de réponse que DummyJSON
export const handlers = [
  http.get('http://localhost:4000/users', () => HttpResponse.json({ users: sampleCollaborators })),
  http.get('http://localhost:4000/users/:id/posts', () => HttpResponse.json({ posts })),
]
