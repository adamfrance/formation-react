import { useEffect, useState } from 'react'
import Header from './components/Header.tsx'
import Panel from './components/Panel.tsx'
import CollaboratorCard from './components/CollaboratorCard.tsx'
import type { Collaborator } from './types.ts'

const API_URL = 'http://localhost:4000/users?limit=0&select=firstName,lastName,email,phone,image,role,company,address'

interface UsersResponse {
  users: Collaborator[]
}

function App() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]) // vide au départ, rempli par l'API
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('') // le texte de la recherche
  const [department, setDepartment] = useState('') // le service choisi ('' = tous)

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`) // fetch ne rejette pas sur une erreur HTTP
        return response.json() as Promise<UsersResponse>
      })
      .then((data) => setCollaborators(data.users))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, []) // [] : une seule fois, après le premier rendu

  const departments = [...new Set(collaborators.map((c) => c.company.department))].sort() // sans doublons, triés
  const search = query.trim().toLowerCase()
  const visible = collaborators.filter(
    (c) =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(search) &&
      (department === '' || c.company.department === department),
  ) // valeur dérivée : recalculée à chaque rendu, ce n'est pas un état

  return (
    <div className="app">
      <Header />
      <div className="toolbar">
        <label htmlFor="recherche" className="sr-only">Rechercher</label>
        <input
          id="recherche"
          className="search"
          type="search"
          placeholder="Rechercher un collaborateur…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <label htmlFor="service" className="sr-only">Filtrer par service</label>
        <select id="service" value={department} onChange={(event) => setDepartment(event.target.value)}>
          <option value="">Tous les services</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
      <Panel title="Annuaire" actions={<span>{visible.length} / {collaborators.length}</span>}>
        {loading && <p className="loading">Chargement des collaborateurs…</p>}
        {error && <p className="error" role="alert">Impossible de charger l'annuaire : {error}</p>}
        {!loading && !error && visible.length === 0 && (
          <p className="empty">Aucun collaborateur ne correspond à la recherche.</p>
        )}
        <ul className="card-grid">
          {visible.map((c) => (
            <CollaboratorCard key={c.id} collaborator={c} />
          ))}
        </ul>
      </Panel>
    </div>
  )
}

export default App
