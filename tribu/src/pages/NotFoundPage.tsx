import { Link, useLocation } from 'react-router'

// La page 404 : toute adresse inconnue arrive ici
function NotFoundPage() {
  const { pathname } = useLocation() // l'adresse demandée
  return (
    <div className="not-found">
      <h2>Page introuvable</h2>
      <p>L'adresse <code>{pathname}</code> ne correspond à aucune page de Tribu.</p>
      <Link to="/">Revenir à l'accueil</Link>
    </div>
  )
}

export default NotFoundPage
