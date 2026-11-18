import Exemple from './exemples/j1-08-formulaire.tsx' // l'exemple affiché : on change ce nom à chaque exemple

// La page des exemples : un exemple à la fois
function App() {
  return (
    <div className="page">
      <h1>Exemples React</h1>
      <Exemple />
    </div>
  )
}

export default App
