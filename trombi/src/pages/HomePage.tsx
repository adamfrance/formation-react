import { Link } from "react-router";
import { useAppSelector } from "../store/hooks.ts";

function HomePage() {
  const items = useAppSelector((state) => state.collaborators.items);
  const added = useAppSelector((state) => state.collaborators.added);
  const collaborators = [...added, ...items];
  const departments = [
    ...new Set(collaborators.map((c) => c.company.department)),
  ].sort();
  const admins = collaborators.filter((c) => c.role === "admin").length;
  const byDepartment = departments.map((department) => ({
    department,
    count: collaborators.filter((c) => c.company.department === department)
      .length,
  }));

  return (
    <>
      <div className="page-title">
        <h2>Bienvenue sur Trombi</h2>
        <Link to="/annuaire">Ouvrir l'annuaire →</Link>
      </div>
      <div className="stats">
        <div className="stat">
          <strong>{collaborators.length}</strong>
          <span>collaborateurs</span>
        </div>
        <div className="stat">
          <strong>{departments.length}</strong>
          <span>services</span>
        </div>
        <div className="stat">
          <strong>{admins}</strong>
          <span>administrateurs</span>
        </div>
      </div>
      <h3 className="page-title">Par service</h3>
      <div className="stats">
        {byDepartment.map(({ department, count }) => (
          <Link
            key={department}
            className="stat"
            to={`/annuaire?service=${encodeURIComponent(department)}`}
          >
            <strong>{count}</strong>
            <span>{department}</span>
          </Link>
        ))}
      </div>
    </>
  );
}

export default HomePage;
