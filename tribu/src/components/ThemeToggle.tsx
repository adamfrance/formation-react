import { useState } from 'react'
import type { Theme } from '../types.ts'

// Le bouton jour / nuit : l'état « theme » décide de l'icône affichée
function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('clair') // valeur initiale : thème clair
  const next: Theme = theme === 'clair' ? 'sombre' : 'clair' // le thème proposé par le bouton

  const handleClick = () => {
    setTheme(next) // React refait le rendu du composant avec la nouvelle valeur
    document.documentElement.dataset.theme = next
  }

  return (
    <button type="button" className="theme-toggle" onClick={handleClick} aria-label={`Passer au thème ${next}`}>
      {theme === 'clair' ? '🌙' : '☀️'}
    </button>
  )
}

export default ThemeToggle
