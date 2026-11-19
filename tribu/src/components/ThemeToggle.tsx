import { useTheme } from '../contexts/ThemeContext.ts'

// Le bouton jour / nuit : il lit le thème dans le contexte, sans props
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const next = theme === 'clair' ? 'sombre' : 'clair'

  return (
    <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={`Passer au thème ${next}`}>
      {theme === 'clair' ? '🌙' : '☀️'}
    </button>
  )
}

export default ThemeToggle
