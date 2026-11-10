import { useState } from 'react'
import type { ChangeEvent, FocusEvent, SubmitEvent } from 'react'

export const titre = 'Formulaire contrôlé'

interface Valeurs {
  nom: string
  espece: string
}

type Erreurs = Partial<Record<keyof Valeurs, string>> // au plus un message par champ

const VIDE: Valeurs = { nom: '', espece: '' }

// Les erreurs se calculent à partir des valeurs : un objet vide veut dire « valide »
function valider(valeurs: Valeurs): Erreurs {
  const erreurs: Erreurs = {}
  if (valeurs.nom.trim().length < 2) erreurs.nom = 'Au moins 2 caractères'
  if (valeurs.espece === '') erreurs.espece = 'Choisissez une espèce'
  return erreurs
}

export default function Formulaire() {
  const [valeurs, setValeurs] = useState<Valeurs>(VIDE) // un seul état pour tous les champs
  const [touches, setTouches] = useState<Partial<Record<keyof Valeurs, boolean>>>({}) // champs déjà quittés
  const [personnages, setPersonnages] = useState<{ id: number; texte: string }[]>([])

  const erreurs = valider(valeurs) // valeur dérivée
  const valide = Object.keys(erreurs).length === 0

  // Un seul gestionnaire : l'attribut name dit quel champ modifier
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setValeurs((prev) => ({ ...prev, [name]: value }))
  }

  const handleBlur = (event: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = event.target
    setTouches((prev) => ({ ...prev, [name]: true })) // l'erreur s'affiche une fois le champ quitté
  }

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault() // pas de rechargement de la page
    setPersonnages((prev) => [...prev, { id: Date.now(), texte: `${valeurs.nom.trim()} (${valeurs.espece})` }])
    setValeurs(VIDE)
    setTouches({})
  }

  return (
    <div className="colonnes">
      <form className="boite" onSubmit={handleSubmit} noValidate>
        <p>
          <label htmlFor="nom">Nom </label>
          <input id="nom" name="nom" value={valeurs.nom} onChange={handleChange} onBlur={handleBlur} />
          {touches.nom && erreurs.nom && <span> {erreurs.nom}</span>}
        </p>
        <p>
          <label htmlFor="espece">Espèce </label>
          <select id="espece" name="espece" value={valeurs.espece} onChange={handleChange} onBlur={handleBlur}>
            <option value="">Choisir…</option>
            <option value="Humain">Humain</option>
            <option value="Alien">Alien</option>
          </select>
          {touches.espece && erreurs.espece && <span> {erreurs.espece}</span>}
        </p>
        <button type="submit" disabled={!valide}>Ajouter</button>
      </form>
      <div className="boite">
        <h3>Personnages ajoutés : {personnages.length}</h3>
        <ul>
          {personnages.map((p) => (
            <li key={p.id}>{p.texte}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
