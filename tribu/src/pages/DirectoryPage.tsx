import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import Panel from '../components/Panel.tsx'
import SearchBar from '../components/SearchBar.tsx'
import Filters from '../components/Filters.tsx'
import type { FilterValues } from '../components/Filters.tsx'
import CollaboratorList from '../components/CollaboratorList.tsx'
import DataTable from '../components/DataTable.tsx'
import RoleBadge from '../components/RoleBadge.tsx'
import type { Column } from '../components/DataTable.tsx'
import { withLoading } from '../hocs/withLoading.tsx'
import { withError } from '../hocs/withError.tsx'
import { useFavorites } from '../contexts/FavoritesContext.ts'
import { useAppDispatch } from '../store/hooks.ts'
import { memberAdded } from '../store/teamSlice.ts'
import { useCollaborators, useDepartments } from '../queries.ts'
import type { Collaborator } from '../types.ts'

const EnhancedCollaboratorList = withError(withLoading(CollaboratorList)) // deux HOC composés, créés une fois

// Les colonnes du tableau : chaque render prop dit comment afficher une cellule
const columns: Column<Collaborator>[] = [
  {
    key: 'nom',
    label: 'Nom',
    render: (c) => <Link to={`/annuaire/${c.id}`}>{c.firstName} {c.lastName}</Link>,
    sortValue: (c) => c.lastName,
  },
  { key: 'service', label: 'Service', render: (c) => c.company.department, sortValue: (c) => c.company.department },
  { key: 'poste', label: 'Poste', render: (c) => c.company.title, sortValue: (c) => c.company.title },
  { key: 'role', label: 'Rôle', render: (c) => <RoleBadge role={c.role} /> },
]

// L'annuaire : recherche, filtres, cartes ou tableau
function DirectoryPage() {
  const dispatch = useAppDispatch()
  const { data: collaborators = [], isPending: loading, isFetching, error, refetch } = useCollaborators() // le cache
  const departments = useDepartments()
  const [params, setParams] = useSearchParams() // la recherche et les filtres vivent dans l'adresse
  const query = params.get('q') ?? ''
  const filters: FilterValues = { department: params.get('service') ?? '', onlyFavorites: params.get('favoris') === '1' }
  const { favorites } = useFavorites() // pour le filtre « Favoris uniquement »
  const [view, setView] = useState<'cartes' | 'tableau'>('cartes')

  const search = query.trim().toLowerCase()
  const visible = collaborators.filter(
    (c) =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(search) &&
      (filters.department === '' || c.company.department === filters.department) &&
      (!filters.onlyFavorites || favorites.includes(c.id)),
  ) // valeur dérivée : recalculée à chaque rendu, ce n'est pas un état

  // Change une ou plusieurs valeurs de l'adresse, en gardant les autres
  const updateParams = (changes: Record<string, string>) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value)
          else next.delete(key) // une valeur vide disparaît de l'adresse
        }
        return next
      },
      { replace: true }, // pas une entrée d'historique par lettre tapée
    )
  }

  return (
    <>
      <div className="toolbar">
        <SearchBar value={query} onChange={(q) => updateParams({ q })} />
        <Filters
          departments={departments}
          value={filters}
          onChange={(f) => updateParams({ service: f.department, favoris: f.onlyFavorites ? '1' : '' })}
        />
      </div>
      <main>
        <Panel
          title="Annuaire"
          actions={
            <>
              <span>{visible.length} / {collaborators.length}</span>
              {/* isFetching : un appel est en cours, même quand des données sont déjà affichées */}
              <button type="button" className="btn btn-ghost" onClick={() => refetch()} disabled={isFetching}>
                {isFetching ? 'Mise à jour…' : 'Actualiser'}
              </button>
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
              error={error && `Impossible de charger l'annuaire : ${error.message}`}
              onRetry={() => refetch()}
              loading={loading}
              collaborators={visible}
              onAddToTeam={(c) => dispatch(memberAdded(c))}
            />
          ) : (
            <DataTable rows={visible} columns={columns} rowKey={(c) => c.id} />
          )}
        </Panel>
      </main>
    </>
  )
}

export default DirectoryPage
