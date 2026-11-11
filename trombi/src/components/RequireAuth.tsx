import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAppSelector } from "../store/hooks.ts";
import type { Role } from "../types.ts";

interface RequireAuthProps {
  children: ReactNode;
  role?: Role;
}

function RequireAuth({ children, role }: RequireAuthProps) {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) {
    return (
      <Navigate to="/connexion" state={{ from: location.pathname }} replace />
    );
  }
  if (role && user.role !== role) {
    return (
      <p className="error" role="alert">
        Cette page est réservée aux administrateurs.
      </p>
    );
  }
  return children;
}

export default RequireAuth;
