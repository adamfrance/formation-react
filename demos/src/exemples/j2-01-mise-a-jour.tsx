import { useState } from 'react'

export const titre = "Mise à jour de l'état"

export default function MiseAJour() {
  const [count, setCount] = useState(0)
  const [equipe, setEquipe] = useState<string[]>(['Rick'])

  // Trois appels avec la valeur lue au rendu : elle vaut la même chose les trois fois
  const plusTroisValeur = () => {
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1)
  }

  // Trois appels avec une fonction : chacune reçoit la valeur laissée par la précédente
  const plusTroisFonction = () => {
    setCount((c) => c + 1)
    setCount((c) => c + 1)
    setCount((c) => c + 1)
  }

  // Le tableau existant est modifié : React reçoit le même tableau et ne refait pas le rendu
  const ajouterPush = () => {
    equipe.push('Morty')
    setEquipe(equipe)
  }

  // Un nouveau tableau : React refait le rendu
  const ajouterCopie = () => setEquipe((prev) => [...prev, 'Summer'])

  return (
    <div className="colonnes">
      <div className="boite">
        <h3>Compteur : {count}</h3>
        <button type="button" onClick={plusTroisValeur}>+3 avec setCount(count + 1)</button>{' '}
        <button type="button" onClick={plusTroisFonction}>+3 avec setCount(c =&gt; c + 1)</button>{' '}
        <button type="button" onClick={() => setCount(0)}>Remise à zéro</button>
      </div>
      <div className="boite">
        <h3>Équipe : {equipe.join(', ')}</h3>
        <button type="button" onClick={ajouterPush}>Ajouter Morty avec push</button>{' '}
        <button type="button" onClick={ajouterCopie}>Ajouter Summer avec [...prev]</button>
      </div>
    </div>
  )
}
