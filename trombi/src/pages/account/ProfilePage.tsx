import Avatar from "../../components/Avatar.tsx";
import RoleBadge from "../../components/RoleBadge.tsx";
import { useAppSelector } from "../../store/hooks.ts";

function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  if (!user) return null;

  return (
    <div className="detail-header">
      <Avatar
        name={`${user.firstName} ${user.lastName}`}
        src={user.image}
        size={88}
      />
      <div>
        <h3>
          {user.firstName} {user.lastName}
        </h3>
        <p>
          {user.email} · identifiant {user.username}
        </p>
        <RoleBadge role={user.role} />
      </div>
    </div>
  );
}

export default ProfilePage;
