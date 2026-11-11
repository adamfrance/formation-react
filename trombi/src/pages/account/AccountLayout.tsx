import { NavLink, Outlet } from "react-router";
import Panel from "../../components/Panel.tsx";

function AccountLayout() {
  return (
    <Panel title="Mon espace">
      <nav className="subnav" aria-label="Mon espace">
        <NavLink to="/mon-espace" end>
          Profil
        </NavLink>
        <NavLink to="/mon-espace/taches">Mes tâches</NavLink>
      </nav>
      <Outlet />
    </Panel>
  );
}

export default AccountLayout;
