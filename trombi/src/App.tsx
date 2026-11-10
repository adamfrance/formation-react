import { useState } from 'react'
import Header from './components/Header.tsx'
import Panel from './components/Panel.tsx'
import SearchBar from './components/SearchBar.tsx'
import Filters from './components/Filters.tsx'
import type { FilterValues } from './components/Filters.tsx'
import CollaboratorCard from './components/CollaboratorCard.tsx'
import CollaboratorDetail from './components/CollaboratorDetail.tsx'
import NewCollaboratorForm from './components/NewCollaboratorForm.tsx'
import { useFetch } from './hooks/useFetch.ts'
import { useLocalStorage } from './hooks/useLocalStorage.ts'
import type { Collaborator } from './types.ts'

const API_URL = 'http://localhost:4000/users?limit=0&select=firstName,lastName,email,phone,image,role,company,address'

interface UsersResponse {
  users: Collaborator[]
}

function App() {
  const { data, loading, error, refetch } = useFetch<UsersResponse>(API_URL) // tout le chargement en une ligne
  const [added, setAdded] = useState<Collaborator[]>([]) // les collaborateurs proposés dans ce navigateur
  const [query, setQuery] = useState('') // le texte de la recherche
  const [filters, setFilters] = useState<FilterValues>({ department: '', onlyFavorites: false })
  const [favorites, setFavorites] = useLocalStorage<number[]>('trombi.favoris', []) // gardés au rechargement
  const [selectedId, setSelectedId] = useState<number | null>(null) // le collaborateur affiché dans la fiche

  const collaborators = [...added, ...(data?.users ?? [])] // deux sources combinées à chaque rendu

  const departments = [...new Set(collaborators.map((c) => c.company.department))].sort() // sans doublons, triés
  const search = query.trim().toLowerCase()
  const visible = collaborators.filter(
    (c) =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(search) &&
      (filters.department === '' || c.company.department === filters.department) &&
      (!filters.onlyFavorites || favorites.includes(c.id)),
  ) // valeur dérivée : recalculée à chaque rendu, ce n'est pas un état
  const selected = collaborators.find((c) => c.id === selectedId) ?? null

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id])) // un nouveau tableau
  }

  const handleAdd = (collaborator: Collaborator) => {
    setAdded((prev) => [collaborator, ...prev]) // le nouveau venu en tête de liste
  }

  return (
    <div className="app">
      <Header />
      <div className="toolbar">
        <SearchBar value={query} onChange={setQuery} />
        <Filters departments={departments} value={filters} onChange={setFilters} />
      </div>
      <main className="layout">
        <Panel title="Annuaire" actions={<span>{visible.length} / {collaborators.length}</span>}>
          {loading && <p className="loading">Chargement des collaborateurs…</p>}
          {error && (
            <p className="error" role="alert">
              Impossible de charger l'annuaire : {error}{' '}
              <button type="button" className="btn" onClick={refetch}>Réessayer</button>
            </p>
          )}
          {!loading && !error && visible.length === 0 && (
            <p className="empty">Aucun collaborateur ne correspond à la recherche.</p>
          )}
          <ul className="card-grid">
            {visible.map((c) => (
              <CollaboratorCard
                key={c.id}
                collaborator={c}
                isFavorite={favorites.includes(c.id)}
                isSelected={c.id === selectedId}
                onSelect={setSelectedId}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </ul>
        </Panel>
        <aside className="side">
          {selected && (
            <Panel
              title="Fiche"
              actions={<button type="button" className="btn btn-ghost" onClick={() => setSelectedId(null)}>Fermer</button>}
            >
              <CollaboratorDetail key={selected.id} collaborator={selected} />
            </Panel>
          )}
          <Panel title="Proposer un collaborateur">
            <NewCollaboratorForm departments={departments} onAdd={handleAdd} />
          </Panel>
        </aside>
      </main>
    </div>
  )
}

export default App
