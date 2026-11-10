import ThemeToggle from './ThemeToggle.tsx'

// L'en-tête de l'application : le logo, le nom et le bouton jour / nuit
function Header() {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-logo" aria-hidden="true">T</span>
        <div>
          <h1>Trombi</h1>
          <p>L'annuaire des collaborateurs</p>
        </div>
      </div>
      <ThemeToggle />
    </header>
  )
}

export default Header
