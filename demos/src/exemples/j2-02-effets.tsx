import { useEffect, useState } from 'react'

export const titre = 'Effets et dépendances'

// Ouvrez la console : quel effet s'exécute, et quand ?
export default function Effets() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')

  useEffect(() => {
    console.log('① sans tableau : après chaque rendu')
  })

  useEffect(() => {
    console.log('② [] : au montage')
    return () => console.log('② nettoyage : au démontage')
  }, [])

  useEffect(() => {
    console.log(`③ [count] : count vaut ${count}`)
    return () => console.log(`③ nettoyage de l'effet où count valait ${count}`)
  }, [count])

  return (
    <div className="boite">
      <h3>count = {count}</h3>
      <button type="button" onClick={() => setCount((c) => c + 1)}>count + 1</button>{' '}
      <input value={text} onChange={(event) => setText(event.target.value)} placeholder="Tapez ici" />
    </div>
  )
}
