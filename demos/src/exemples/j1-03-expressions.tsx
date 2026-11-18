// Expressions, conditions et listes : les trois écritures du JSX
export const titre = 'Expressions, conditions, listes'

const personnages = [
  { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human' },
  { id: 2, name: 'Morty Smith', status: 'Alive', species: 'Human' },
  { id: 8, name: 'Adjudicator Rick', status: 'Dead', species: 'Human' },
]

export default function Expressions() {
  return (
    <div className="boite">
      <p>{personnages.length} personnages</p>
      <ul>
        {personnages.map((p) => (
          <li key={p.id}>
            {p.name} · {p.species}
            {p.status === 'Dead' && <strong> (mort)</strong>}
          </li>
        ))}
      </ul>
      {personnages.length > 0 ? <p>Liste prête</p> : <p>Aucun personnage</p>}
    </div>
  )
}
