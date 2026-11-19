import { getErrorMessage } from 'react-error-boundary'
import type { FallbackProps } from 'react-error-boundary'

// L'écran de secours d'une page qui a planté : l'en-tête et la navigation restent utilisables
function PageError({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="error-boundary" role="alert">
      <h2>Cette page n'a pas pu s'afficher</h2>
      <p className="error">{getErrorMessage(error) ?? 'Erreur inconnue'}</p>
      <p>
        <button type="button" className="btn" onClick={resetErrorBoundary}>Réessayer</button>{' '}
        {/* un fichier de page qui n'a pas pu être téléchargé : React garde l'échec, seul un rechargement répare */}
        <button type="button" className="btn btn-ghost" onClick={() => location.reload()}>Recharger la page</button>
      </p>
    </div>
  )
}

export default PageError
