import Link from 'next/link'

// Affichée par notFound() et pour toute adresse inconnue
export default function NotFound() {
  return (
    <div className="not-found">
      <h2>Page introuvable</h2>
      <Link href="/">Revenir à l&apos;accueil</Link>
    </div>
  )
}
