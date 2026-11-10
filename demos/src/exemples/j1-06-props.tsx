// Des props typées : obligatoire, facultative, avec une valeur par défaut
export const titre = 'Props typées et valeurs par défaut'

interface StatutProps {
  status: 'Alive' | 'Dead' | 'unknown' // obligatoire, et seulement ces trois valeurs
  label?: string // facultative : peut manquer
  size?: number // facultative, 14 par défaut
}

const COULEURS = { Alive: 'green', Dead: 'crimson', unknown: 'gray' }

function Statut({ status, label, size = 14 }: StatutProps) {
  return <span style={{ color: COULEURS[status], fontSize: size }}> ● {label ?? status}</span>
}

export default function PropsTypees() {
  return (
    <ul className="lignes">
      <li>Rick Sanchez <Statut status="Alive" /></li>
      <li>Adjudicator Rick <Statut status="Dead" label="mort" /></li>
      <li>Abradolf Lincler <Statut status="unknown" size={20} /></li>
    </ul>
  )
}
