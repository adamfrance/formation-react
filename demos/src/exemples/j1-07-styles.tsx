import type { CSSProperties } from 'react'
import styles from './j1-07-styles.module.css'

export const titre = 'Styler un composant'

// Un personnage de la série Rick et Morty, écrit dans l'exemple
const personnage = { nom: 'Rick Sanchez', espece: 'Humain', vivant: true }

// La pastille : sa taille arrive en prop, donc un style en ligne
function Pastille({ taille }: { taille: number }) {
  const style: CSSProperties = { width: taille, height: taille, borderRadius: taille / 2 } // propriétés en camelCase
  return <span className={styles.pastille} style={style} />
}

export default function Styles() {
  return (
    <div className="boite">
      <article className={styles.carte}>
        <Pastille taille={personnage.vivant ? 16 : 8} />
        <h3 className={styles.nom}>{personnage.nom}</h3>
        <p className={styles.espece}>{personnage.espece}</p>
      </article>
      <p>
        Classe réelle de la carte : <code>{styles.carte}</code>
      </p>
    </div>
  )
}
