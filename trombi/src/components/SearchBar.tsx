interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({value, onChange}: SearchBarProps) {
    return (
      <>
        <label htmlFor="recherche" className="sr-only">
          Rechercher
        </label>
        <input
          id="recherche"
          className="search"
          type="search"
          placeholder="Rechercher un collaborateur…"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </>
    );
}