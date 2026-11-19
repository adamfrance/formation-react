import type { Role } from '../types.ts'

// Le badge d'un rôle : rien pour un utilisateur ordinaire
function RoleBadge({ role }: { role: Role }) {
  if (role === 'admin') return <span className="badge badge-admin">Admin</span>
  if (role === 'moderator') return <span className="badge">Modérateur</span>
  return null
}

export default RoleBadge
