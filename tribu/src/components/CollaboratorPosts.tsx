import { useFetch } from '../hooks/useFetch.ts'
import type { Post } from '../types.ts'

// Les publications d'un collaborateur : chargées seulement quand l'onglet est affiché
function CollaboratorPosts({ id }: { id: number }) {
  const { data, loading, error } = useFetch<{ posts: Post[] }>(`http://localhost:4000/users/${id}/posts`)
  const posts = data?.posts ?? []

  if (loading) return <p className="loading">Chargement des publications…</p>
  if (error) return <p className="error" role="alert">Publications indisponibles ({error})</p>
  if (posts.length === 0) return <p className="empty">Aucune publication.</p>
  return (
    <ul className="tasks">
      {posts.map((post) => (
        <li key={post.id}>
          <strong>{post.title}</strong> · {post.views} vues
        </li>
      ))}
    </ul>
  )
}

export default CollaboratorPosts
