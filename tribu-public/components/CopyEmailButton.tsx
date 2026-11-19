'use client' // un composant client : son code part aussi dans le navigateur, il peut avoir un état et des événements

import { useState } from 'react'

// Copie l'adresse dans le presse-papiers : une action du navigateur, impossible à faire sur le serveur
export default function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(email)
    setCopied(true)
  }

  return (
    <button type="button" className="btn" onClick={copy}>
      {copied ? 'Adresse copiée' : "Copier l'e-mail"}
    </button>
  )
}
