import { useQuery } from '@tanstack/react-query'
import { postsQuery } from '../queries.ts'

// Les publications d'un collaborateur : chargées par React Query, gardées dans son cache
function CollaboratorPosts({ id }: { id: number }) {
  const { data: posts = [], isPending, error } = useQuery(postsQuery(id))

  if (isPending) return <p className="loading">Chargement des publications…</p>
  if (error) return <p className="error" role="alert">Publications indisponibles ({error.message})</p>
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
