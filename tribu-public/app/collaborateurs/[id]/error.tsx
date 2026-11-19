'use client' // un fichier error.tsx est un Error Boundary : il s'exécute dans le navigateur

// Affiché à la place de la fiche quand son rendu échoue sur le serveur (API en panne…)
// En production, le message d'une erreur du serveur n'arrive pas jusqu'ici : il reste dans le journal du serveur
export default function CollaboratorError({ retry }: { retry: () => void }) {
  return (
    <div className="error-boundary" role="alert">
      <h2>La fiche n&apos;a pas pu s&apos;afficher</h2>
      <p>Le service est momentanément indisponible.</p>
      <button type="button" className="btn" onClick={() => retry()}>Réessayer</button>
    </div>
  )
}
