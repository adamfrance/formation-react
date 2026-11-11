export interface FilterValues {
  department: string;
  onlyFavorites: boolean;
}

interface FiltersProps {
  departments: string[];
  value: FilterValues;
  onChange: (value: FilterValues) => void;
}

function Filters({ departments, value, onChange }: FiltersProps) {
  return (
    <>
      <label htmlFor="service" className="sr-only">
        Filtrer par service
      </label>
      <select
        id="service"
        value={value.department}
        onChange={(event) =>
          onChange({ ...value, department: event.target.value })
        } // un nouvel objet, le reste inchangé
      >
        <option value="">Tous les services</option>
        {departments.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <label className="check">
        <input
          type="checkbox"
          checked={value.onlyFavorites}
          onChange={(event) =>
            onChange({ ...value, onlyFavorites: event.target.checked })
          }
        />
        Favoris uniquement
      </label>
    </>
  );
}

export default Filters;
