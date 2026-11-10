// TypeScript vérifie les données avant l'exécution : un personnage de l'API Rick and Morty
type Statut = 'Alive' | 'Dead' | 'unknown' // union : une seule de ces trois chaînes

interface Personnage {
  id: number
  name: string
  status: Statut
  species: string
  type?: string // facultatif : le champ peut manquer
}

const rick: Personnage = { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human' }
const zombie: Personnage = { id: 2, name: 'Zombie Rick', status: 'Zombie', species: 'Human' }

console.log(rick.nmae, zombie.name)
