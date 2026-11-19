import { useEffect, useState } from 'react'
import Header from './components/Header.tsx'
import Panel from './components/Panel.tsx'
import CollaboratorCard from './components/CollaboratorCard.tsx'
import CollaboratorDetail from './components/CollaboratorDetail.tsx'
import NewCollaboratorForm from './components/NewCollaboratorForm.tsx'
import TeamPanel from './components/TeamPanel.tsx'
import { useLocalStorage } from './hooks/useLocalStorage.ts'
import { useAppDispatch, useAppSelector } from './store/hooks.ts'
import { collaboratorAdded, fetchCollaborators } from './store/collaboratorsSlice.ts'
import { selectAllCollaborators, selectDepartments } from './store/selectors.ts'
import type { Collaborator } from './types.ts'

function App() {
  const dispatch = useAppDispatch()
  const collaborators = useAppSelector(selectAllCollaborators) // calculé dans le store, mémoïsé
  const departments = useAppSelector(selectDepartments)
  const status = useAppSelector((state) => state.collaborators.status)
  const error = useAppSelector((state) => state.collaborators.error)
  const [query, setQuery] = useState('') // le texte de la recherche
  const [department, setDepartment] = useState('') // le service choisi ('' = tous)
  const [favorites, setFavorites] = useLocalStorage<number[]>('tribu.favoris', []) // gardés au rechargement
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null) // le collaborateur affiché dans la fiche

  useEffect(() => {
    dispatch(fetchCollaborators()) // le store charge les données, une seule fois
  }, [dispatch])

  const loading = status === 'idle' || status === 'loading'

  const search = query.trim().toLowerCase()
  const visible = collaborators.filter(
    (c) =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(search) &&
      (department === '' || c.company.department === department) &&
      (!onlyFavorites || favorites.includes(c.id)),
  ) // valeur dérivée : recalculée à chaque rendu, ce n'est pas un état
  const selected = collaborators.find((c) => c.id === selectedId) ?? null

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id])) // un nouveau tableau
  }

  const handleAdd = (collaborator: Collaborator) => {
    dispatch(collaboratorAdded(collaborator)) // le store range le nouveau venu
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
          {loading && <p className="loading">Chargement des collaborateurs…</p>}
          {error && (
            <p className="error" role="alert">
              Impossible de charger l'annuaire : {error}{' '}
              <button type="button" className="btn" onClick={() => dispatch(fetchCollaborators())}>Réessayer</button>
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
          <Panel title="Équipe projet">
            <TeamPanel />
          </Panel>
          <Panel title="Proposer un collaborateur">
            <NewCollaboratorForm departments={departments} onAdd={handleAdd} />
          </Panel>
        </aside>
      </main>
    </div>
  )
}

export default App
