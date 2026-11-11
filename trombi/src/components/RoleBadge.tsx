import type { Role } from "../types.ts";

function RoleBadge({ role }: { role: Role }) {
  if (role === "admin") return <span className="badge badge-admin">Admin</span>;
  if (role === "moderator") return <span className="badge">Modérateur</span>;
  return null;
}

export default RoleBadge;
