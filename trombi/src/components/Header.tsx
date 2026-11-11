import { NavLink } from 'react-router'
import ThemeToggle from './ThemeToggle.tsx'
import { useAppDispatch, useAppSelector } from "../store/hooks.ts";
import { logout } from "../store/authSlice.ts";

// L'en-tête de l'application : le logo, le nom et le bouton jour / nuit, la navigation
function Header() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-logo" aria-hidden="true">
          T
        </span>
        <div>
          <h1>Trombi</h1>
          <p>L'annuaire des collaborateurs</p>
        </div>
      </div>
      <nav className="nav" aria-label="Navigation principale">
        <NavLink to="/" end>
          Accueil
        </NavLink>
        <NavLink to="/annuaire">Annuaire</NavLink>
        <NavLink to="/equipe">Équipe</NavLink>
        {user ? (
          <>
            {user.role === "admin" && (
              <NavLink to="/admin">Administration</NavLink>
            )}
            <NavLink to="/mon-espace">{user.firstName}</NavLink>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => dispatch(logout())}
            >
              Déconnexion
            </button>
          </>
        ) : (
          <NavLink to="/connexion">Connexion</NavLink>
        )}
      </nav>
      <ThemeToggle />
    </header>
  );
}

export default Header
