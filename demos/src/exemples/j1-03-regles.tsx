// Les règles du JSX : className, htmlFor, camelCase, style, balises fermées, fragment
export const titre = 'Les règles du JSX'

export default function Regles() {
  return (
    <>
      {/* un fragment : deux éléments côte à côte, sans balise autour */}
      <div className="boite">
        <img src="https://rickandmortyapi.com/api/character/avatar/1.jpeg" alt="Rick Sanchez" width={96} height={96} style={{ borderRadius: '50%' }} />
        <h3>Rick Sanchez</h3>
      </div>
      <form className="boite">
        <label htmlFor="personnage">Personnage</label>
        <input id="personnage" type="search" placeholder="Rick, Morty…" aria-describedby="aide" />
        <p id="aide">Cliquez sur le libellé : le curseur va dans le champ.</p>
      </form>
    </>
  )
}
