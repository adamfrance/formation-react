import { useEffect, useState } from 'react'

export const titre = 'Hook personnalisé : un état qui survit au rechargement'

// Comme useState, mais la valeur est gardée dans sessionStorage, le temps de l'onglet
function useSessionState<T>(cle: string, initiale: T) {
  const [valeur, setValeur] = useState<T>(() => {
    const enregistree = sessionStorage.getItem(cle) // lue une seule fois, au premier rendu
    return enregistree === null ? initiale : (JSON.parse(enregistree) as T)
  })

  useEffect(() => {
    sessionStorage.setItem(cle, JSON.stringify(valeur)) // réécrite à chaque changement
  }, [cle, valeur])

  return [valeur, setValeur] as const // un couple [valeur, fonction], comme useState
}

function Votes({ personnage }: { personnage: string }) {
  const [votes, setVotes] = useSessionState(`demo.votes.${personnage}`, 0) // chaque appel a son propre état
  return (
    <li>
      {personnage} : {votes} vote(s){' '}
      <button type="button" onClick={() => setVotes((v) => v + 1)}>+1</button>
    </li>
  )
}

export default function HookStockage() {
  return (
    <div className="boite">
      <ul className="lignes">
        <Votes personnage="Rick" />
        <Votes personnage="Morty" />
      </ul>
    </div>
  )
}
