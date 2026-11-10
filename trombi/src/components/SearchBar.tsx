interface SearchBarProps {
  value: string // le texte, détenu par le parent
  onChange: (value: string) => void // prévient le parent à chaque frappe
}

// La barre de recherche ne garde rien : elle affiche ce qu'on lui donne et remonte ce qu'on tape
function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <>
      <label htmlFor="recherche" className="sr-only">Rechercher</label>
      <input
        id="recherche"
        className="search"
        type="search"
        placeholder="Rechercher un collaborateur…"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </>
  )
}

export default SearchBar
