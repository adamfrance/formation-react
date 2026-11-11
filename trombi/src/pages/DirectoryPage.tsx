import Panel from "../components/Panel.tsx";
import SearchBar from "../components/SearchBar.tsx";
import Filters from "../components/Filters.tsx";
import type { FilterValues } from "../components/Filters.tsx";
import CollaboratorCard from "../components/CollaboratorCard.tsx";
import { useLocalStorage } from "../hooks/useLocalStorage.ts";
import { useAppDispatch, useAppSelector } from "../store/hooks.ts";
import { fetchCollaborators } from "../store/collaboratorsSlice.ts";
import { useSearchParams } from "react-router";

function DirectoryPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.collaborators.items);
  const added = useAppSelector((state) => state.collaborators.added);
  const status = useAppSelector((state) => state.collaborators.status);
  const error = useAppSelector((state) => state.collaborators.error);
  const [params, setParams] = useSearchParams(); // la recherche et les filtres vivent dans l'adresse
  const query = params.get("q") ?? "";
  const filters: FilterValues = {
    department: params.get("service") ?? "",
    onlyFavorites: params.get("favoris") === "1",
  };
  const [favorites, setFavorites] = useLocalStorage<number[]>(
    "trombi.favoris",
    [],
  );

  const collaborators = [...added, ...items];
  const loading = status === "idle" || status === "loading";

  const departments = [
    ...new Set(collaborators.map((c) => c.company.department)),
  ].sort();
  const search = query.trim().toLowerCase();
  const visible = collaborators.filter(
    (c) =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(search) &&
      (filters.department === "" ||
        c.company.department === filters.department) &&
      (!filters.onlyFavorites || favorites.includes(c.id)),
  );

  const updateParams = (changes: Record<string, string>) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value);
          else next.delete(key); // une valeur vide disparaît de l'adresse
        }
        return next;
      },
      { replace: true }, // pas une entrée d'historique par lettre tapée
    );
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  return (
    <>
      <div className="toolbar">
        <SearchBar value={query} onChange={(q) => updateParams({ q })} />
        <Filters
          departments={departments}
          value={filters}
          onChange={(f) =>
            updateParams({
              service: f.department,
              favoris: f.onlyFavorites ? "1" : "",
            })
          }
        />
      </div>
      <main>
        <Panel
          title="Annuaire"
          actions={
            <span>
              {visible.length} / {collaborators.length}
            </span>
          }
        >
          {loading && <p className="loading">Chargement des collaborateurs…</p>}
          {error && (
            <p className="error" role="alert">
              Impossible de charger l'annuaire : {error}{" "}
              <button
                type="button"
                className="btn"
                onClick={() => dispatch(fetchCollaborators())}
              >
                Réessayer
              </button>
            </p>
          )}
          {!loading && !error && visible.length === 0 && (
            <p className="empty">
              Aucun collaborateur ne correspond à la recherche.
            </p>
          )}
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
      </main>
    </>
  );
}

export default DirectoryPage;
