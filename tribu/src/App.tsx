import { useState } from 'react'
import Header from './components/Header.tsx'
import Panel from './components/Panel.tsx'
import CollaboratorCard from './components/CollaboratorCard.tsx'
import NewCollaboratorForm from './components/NewCollaboratorForm.tsx'
import { sampleCollaborators } from './data/collaborators.ts'
import type { Collaborator } from './types.ts'

function App() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(sampleCollaborators) // on pourra en ajouter
  const [query, setQuery] = useState('') // le texte de la recherche
  const [department, setDepartment] = useState('') // le service choisi ('' = tous)
  const [favorites, setFavorites] = useState<number[]>([]) // identifiants des favoris
  const [onlyFavorites, setOnlyFavorites] = useState(false)

  const departments = [...new Set(collaborators.map((c) => c.company.department))].sort() // sans doublons, triés
  const search = query.trim().toLowerCase()
  const visible = collaborators.filter(
    (c) =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(search) &&
      (department === '' || c.company.department === department) &&
      (!onlyFavorites || favorites.includes(c.id)),
  ) // valeur dérivée : recalculée à chaque rendu, ce n'est pas un état

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id])) // un nouveau tableau
  }

  const handleAdd = (collaborator: Collaborator) => {
    setCollaborators((prev) => [collaborator, ...prev]) // le nouveau venu en tête de liste
  }

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
        <label className="check">
          <input type="checkbox" checked={onlyFavorites} onChange={(event) => setOnlyFavorites(event.target.checked)} />
          Favoris uniquement
        </label>
      </div>
      <main className="layout">
        <Panel title="Annuaire" actions={<span>{visible.length} / {collaborators.length}</span>}>
          {visible.length === 0 && <p className="empty">Aucun collaborateur ne correspond à la recherche.</p>}
          <ul className="card-grid">
            {visible.map((c) => (
              <CollaboratorCard
                key={c.id}
                collaborator={c}
                isFavorite={favorites.includes(c.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </ul>
        </Panel>
        <aside className="side">
          <Panel title="Proposer un collaborateur">
            <NewCollaboratorForm departments={departments} onAdd={handleAdd} />
          </Panel>
        </aside>
      </main>
    </div>
  )
}

export default App
