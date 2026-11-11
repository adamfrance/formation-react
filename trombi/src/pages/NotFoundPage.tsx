import { Link, useLocation } from "react-router";

function NotFoundPage() {
  const { pathname } = useLocation();
  return (
    <div className="not-found">
      <h2>Page introuvable</h2>
      <p>
        Cette adresse <code>{pathname}</code> ne correspond à aucune page de
        Trombi.
      </p>
      <Link to="/">Revenir à l'accueil</Link>
    </div>
  );
}

export default NotFoundPage;
