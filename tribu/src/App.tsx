import { useEffect, useState } from 'react'
import Header from './components/Header.tsx'
import Panel from './components/Panel.tsx'
import SearchBar from './components/SearchBar.tsx'
import Filters from './components/Filters.tsx'
import type { FilterValues } from './components/Filters.tsx'
import CollaboratorList from './components/CollaboratorList.tsx'
import DataTable from './components/DataTable.tsx'
import RoleBadge from './components/RoleBadge.tsx'
import type { Column } from './components/DataTable.tsx'
import CollaboratorDetail from './components/CollaboratorDetail.tsx'
import NewCollaboratorForm from './components/NewCollaboratorForm.tsx'
import TeamPanel from './components/TeamPanel.tsx'
import { withLoading } from './hocs/withLoading.tsx'
import { withError } from './hocs/withError.tsx'
import { useFavorites } from './contexts/FavoritesContext.ts'
import { useAppDispatch, useAppSelector } from './store/hooks.ts'
import { collaboratorAdded, fetchCollaborators } from './store/collaboratorsSlice.ts'
import { selectAllCollaborators, selectDepartments } from './store/selectors.ts'
import type { Collaborator } from './types.ts'

const EnhancedCollaboratorList = withError(withLoading(CollaboratorList)) // deux HOC composés, créés une fois

function App() {
  const dispatch = useAppDispatch()
  const collaborators = useAppSelector(selectAllCollaborators) // calculé dans le store, mémoïsé
  const departments = useAppSelector(selectDepartments)
  const status = useAppSelector((state) => state.collaborators.status)
  const error = useAppSelector((state) => state.collaborators.error)
  const [query, setQuery] = useState('') // le texte de la recherche
  const [filters, setFilters] = useState<FilterValues>({ department: '', onlyFavorites: false })
  const { favorites } = useFavorites() // pour le filtre « Favoris uniquement »
  const [selectedId, setSelectedId] = useState<number | null>(null) // le collaborateur affiché dans la fiche
  const [view, setView] = useState<'cartes' | 'tableau'>('cartes')

  useEffect(() => {
    dispatch(fetchCollaborators()) // le store charge les données, une seule fois
  }, [dispatch])

  const loading = status === 'idle' || status === 'loading'

  const search = query.trim().toLowerCase()
  const visible = collaborators.filter(
    (c) =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(search) &&
      (filters.department === '' || c.company.department === filters.department) &&
      (!filters.onlyFavorites || favorites.includes(c.id)),
  ) // valeur dérivée : recalculée à chaque rendu, ce n'est pas un état
  const selected = collaborators.find((c) => c.id === selectedId) ?? null

  // Les colonnes du tableau : chaque render prop dit comment afficher une cellule
  const columns: Column<Collaborator>[] = [
    {
      key: 'nom',
      label: 'Nom',
      render: (c) => (
        <button type="button" className="btn btn-ghost" onClick={() => setSelectedId(c.id)}>
          {c.firstName} {c.lastName}
        </button>
      ),
      sortValue: (c) => c.lastName,
    },
    { key: 'service', label: 'Service', render: (c) => c.company.department, sortValue: (c) => c.company.department },
    { key: 'poste', label: 'Poste', render: (c) => c.company.title, sortValue: (c) => c.company.title },
    { key: 'role', label: 'Rôle', render: (c) => <RoleBadge role={c.role} /> },
  ]

  const handleAdd = (collaborator: Collaborator) => {
    dispatch(collaboratorAdded(collaborator)) // le store range le nouveau venu
  }

  return (
    <div className="app">
      <Header />
      <div className="toolbar">
        <SearchBar value={query} onChange={setQuery} />
        <Filters departments={departments} value={filters} onChange={setFilters} />
      </div>
      <main className="layout">
        <Panel
          title="Annuaire"
          actions={
            <>
              <span>{visible.length} / {collaborators.length}</span>
              <div className="view-switch" role="group" aria-label="Affichage">
                <button type="button" aria-pressed={view === 'cartes'} onClick={() => setView('cartes')}>Cartes</button>
                <button type="button" aria-pressed={view === 'tableau'} onClick={() => setView('tableau')}>Tableau</button>
              </div>
            </>
          }
        >
          {!loading && !error && visible.length === 0 && (
            <p className="empty">Aucun collaborateur ne correspond à la recherche.</p>
          )}
          {view === 'cartes' ? (
            <EnhancedCollaboratorList
              error={error && `Impossible de charger l'annuaire : ${error}`}
              onRetry={() => dispatch(fetchCollaborators())}
              loading={loading}
              collaborators={visible}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          ) : (
            <DataTable rows={visible} columns={columns} rowKey={(c) => c.id} />
          )}
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
