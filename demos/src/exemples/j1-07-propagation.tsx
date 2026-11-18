import type { MouseEvent } from 'react'

export const titre = 'Propagation des événements'

// Le clic sur un bouton remonte jusqu'à ses parents, sauf si on l'arrête
export default function Propagation() {
  const clicCarte = () => console.log('carte cliquée')

  const clicArrete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation() // le clic ne remonte pas à la carte
    console.log('bouton arrêté cliqué')
  }

  return (
    <div className="boite" onClick={clicCarte}>
      <h3>Une carte cliquable</h3>
      <button type="button" onClick={() => console.log('bouton cliqué')}>Bouton qui laisse remonter</button>{' '}
      <button type="button" onClick={clicArrete}>Bouton qui arrête</button>
    </div>
  )
}
