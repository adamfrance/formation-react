import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export const titre = 'Context : une valeur pour tout un sous-arbre'

type Langue = 'fr' | 'en'

const TEXTES = {
  fr: { espece: 'Espèce', statut: 'Statut', bouton: 'Switch to English' },
  en: { espece: 'Species', statut: 'Status', bouton: 'Passer en français' },
}

// 1. Créer : le contexte, null tant qu'aucun fournisseur ne l'a rempli
const LangueContext = createContext<{ langue: Langue; changerLangue: () => void } | null>(null)

// 2. Fournir : le fournisseur détient l'état et le met dans le contexte
function LangueProvider({ children }: { children: ReactNode }) {
  const [langue, setLangue] = useState<Langue>('fr')
  const changerLangue = () => setLangue((l) => (l === 'fr' ? 'en' : 'fr'))
  return <LangueContext value={{ langue, changerLangue }}>{children}</LangueContext>
}

// 3. Lire : un hook qui signale l'oubli du fournisseur
function useLangue() {
  const contexte = useContext(LangueContext)
  if (!contexte) throw new Error('useLangue doit être utilisé dans un LangueProvider')
  return contexte
}

function BoutonLangue() {
  const { langue, changerLangue } = useLangue() // lu dans le contexte, sans props
  return <button type="button" onClick={changerLangue}>{TEXTES[langue].bouton}</button>
}

function Fiche({ nom, espece, statut }: { nom: string; espece: string; statut: string }) {
  const { langue } = useLangue()
  return (
    <li>
      <strong>{nom}</strong> · {TEXTES[langue].espece} : {espece} · {TEXTES[langue].statut} : {statut}
    </li>
  )
}

// Un intermédiaire qui ne connaît pas la langue : il ne transmet rien
function Liste() {
  return (
    <ul>
      <Fiche nom="Rick Sanchez" espece="Human" statut="Alive" />
      <Fiche nom="Birdperson" espece="Bird-Person" statut="Dead" />
    </ul>
  )
}

export default function Contexte() {
  return (
    <LangueProvider>
      <div className="boite">
        <BoutonLangue />
        <Liste />
      </div>
    </LangueProvider>
  )
}
