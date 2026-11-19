import { getPosts } from '@/lib/api'

// Un composant serveur asynchrone : la fiche s'affiche sans l'attendre, les publications arrivent ensuite
export default async function Posts({ id }: { id: number }) {
  const posts = await getPosts(id)
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
