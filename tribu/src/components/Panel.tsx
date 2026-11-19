import type { ReactNode } from 'react'

interface PanelProps {
  title: string
  actions?: ReactNode // facultatif : ce qui s'affiche à droite du titre
  children: ReactNode // tout ce qu'on écrit entre <Panel> et </Panel>
}

// Un cadre avec un titre : le contenu vient du parent
function Panel({ title, actions, children }: PanelProps) {
  return (
    <section className="panel">
      <header className="panel-header">
        <h2>{title}</h2>
        {actions && <div className="panel-actions">{actions}</div>}
      </header>
      <div className="panel-body">{children}</div>
    </section>
  )
}

export default Panel
