import Link from 'next/link'
import { getCollaborators } from '@/lib/api'

// Un composant serveur : il s'exécute sur le serveur, peut être async et attendre ses données
export default async function HomePage() {
  const collaborators = await getCollaborators()
  const departments = [...new Set(collaborators.map((c) => c.company.department))].sort()

  return (
    <>
      <div className="stats">
        <div className="stat"><strong>{collaborators.length}</strong><span>collaborateurs</span></div>
        <div className="stat"><strong>{departments.length}</strong><span>services</span></div>
      </div>
      {departments.map((department) => (
        <section key={department}>
          <h2 className="page-title">{department}</h2>
          <ul className="team-list">
            {collaborators
              .filter((c) => c.company.department === department)
              .map((c) => (
                <li key={c.id}>
                  <Link href={`/collaborateurs/${c.id}`}>{`${c.firstName} ${c.lastName}`}</Link>
                  <span>{c.company.title}</span>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </>
  )
}
