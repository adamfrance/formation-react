import type { ComponentType } from 'react'

// Affiche l'erreur (et un bouton « Réessayer ») à la place du composant enveloppé
export function withError<P extends object>(Wrapped: ComponentType<P>) {
  function WithError({ error, onRetry, ...props }: P & { error: string | null; onRetry?: () => void }) {
    if (error) {
      return (
        <p className="error" role="alert">
          {error}{' '}
          {onRetry && <button type="button" className="btn" onClick={onRetry}>Réessayer</button>}
        </p>
      )
    }
    return <Wrapped {...(props as P)} />
  }
  WithError.displayName = `WithError(${Wrapped.displayName ?? Wrapped.name})`
  return WithError
}
