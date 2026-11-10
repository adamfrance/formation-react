// Un composant écrit une fois, utilisé trois fois : la carte d'un personnage
export const titre = 'Un composant : la carte de personnage'

const personnages = [
  { id: 1, name: 'Rick Sanchez', species: 'Human', image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg' },
  { id: 2, name: 'Morty Smith', species: 'Human', image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg' },
  { id: 6, name: 'Abadango Cluster Princess', species: 'Alien', image: 'https://rickandmortyapi.com/api/character/avatar/6.jpeg' },
]

// Un composant : une fonction dont le nom commence par une majuscule, qui reçoit ses props et renvoie du JSX
function CartePersonnage({ personnage }: { personnage: { name: string; species: string; image: string } }) {
  const { name, species, image } = personnage // déstructuration : on sort les champs utiles

  return (
    <li className="boite">
      <img src={image} alt="" width={64} height={64} style={{ borderRadius: '50%' }} />
      <h3>{name}</h3>
      <p>{species}</p>
    </li>
  )
}

export default function CartesPersonnages() {
  return (
    <ul className="colonnes3" style={{ listStyle: 'none', padding: 0 }}>
      {personnages.map((p) => (
        <CartePersonnage key={p.id} personnage={p} />
      ))}
    </ul>
  )
}
