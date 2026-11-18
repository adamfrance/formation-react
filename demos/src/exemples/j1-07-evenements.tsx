import type { ChangeEvent, SubmitEvent } from 'react'

export const titre = 'Les événements'

export default function Evenements() {
  const handleClick = () => console.log('clic sur le bouton')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log('saisie :', event.target.value) // event.target : le champ qui a changé
  }

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault() // sans cela, le navigateur recharge la page
    console.log('formulaire envoyé')
  }

  return (
    <form className="boite" onSubmit={handleSubmit}>
      <button type="button" onClick={handleClick}>Bouton</button>{' '}
      <label htmlFor="personnage">Personnage </label>
      <input id="personnage" onChange={handleChange} placeholder="Rick, Morty…" />{' '}
      <button type="submit">Envoyer</button>
    </form>
  )
}
