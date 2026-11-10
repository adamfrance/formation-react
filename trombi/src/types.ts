// Le modèle de données de Trombi : un collaborateur tel que le renvoie l'API DummyJSON
export type Role = 'admin' | 'moderator' | 'user' // union de chaînes : seules ces trois valeurs sont acceptées

export interface Collaborator {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  image: string // adresse de la photo ; chaîne vide si aucune
  role: Role
  company: {
    department: string // le service (Engineering, Marketing…)
    title: string // le poste occupé
  }
  address: {
    city: string
    country: string
  }
}

export type Theme = 'clair' | 'sombre'
