import type { ReactNode } from 'react'

// Composition : un cadre réutilisable, dont le contenu vient du parent
export const titre = 'Composition : children'

interface CadreProps {
  title: string
  footer?: ReactNode // facultatif : un morceau d'interface choisi par le parent
  children: ReactNode // tout ce qu'on écrit entre <Cadre> et </Cadre>
}

function Cadre({ title, footer, children }: CadreProps) {
  return (
    <section className="boite">
      <h3>{title}</h3>
      {children}
      {footer && <p style={{ color: 'gray' }}>{footer}</p>}
    </section>
  )
}

export default function Composition() {
  return (
    <div className="colonnes">
      <Cadre title="Rick Sanchez" footer={<em>51 épisodes</em>}>
        <img src="https://rickandmortyapi.com/api/character/avatar/1.jpeg" alt="" width={96} height={96} />
      </Cadre>
      <Cadre title="Épisode 1">
        <p>Pilot, diffusé le 2 décembre 2013.</p>
      </Cadre>
    </div>
  )
}
