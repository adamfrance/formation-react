import { NavLink, Outlet } from 'react-router'
import Panel from '../../components/Panel.tsx'

// L'espace personnel : un sous-menu, puis la sous-page de l'adresse (routes imbriquées)
function AccountLayout() {
  return (
    <Panel title="Mon espace">
      <nav className="subnav" aria-label="Mon espace">
        <NavLink to="/mon-espace" end>Profil</NavLink>
        <NavLink to="/mon-espace/taches">Mes tâches</NavLink>
      </nav>
      <Outlet />
    </Panel>
  )
}

export default AccountLayout
