import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

// Les métadonnées de toutes les pages : %s est remplacé par le titre propre à chaque page
export const metadata: Metadata = {
  title: { default: 'Tribu public', template: '%s · Tribu public' },
  description: "L'annuaire public des collaborateurs",
}

// La mise en page commune, autour de chaque page
export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="fr">
      <body>
        <div className="app">
          <header className="app-header">
            <div className="brand">
              <span className="brand-logo" aria-hidden="true">T</span>
              <div>
                <h1>Tribu public</h1>
                <p>L&apos;annuaire, rendu sur le serveur</p>
              </div>
            </div>
            <nav className="nav">
              <Link href="/">Accueil</Link>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
