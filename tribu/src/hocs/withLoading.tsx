import type { ComponentType } from 'react'

// Un HOC : une fonction qui reçoit un composant et renvoie un nouveau composant, enrichi d'une prop « loading »
export function withLoading<P extends object>(Wrapped: ComponentType<P>) {
  function WithLoading({ loading, ...props }: P & { loading: boolean }) {
    if (loading) return <div className="spinner" role="status" aria-label="Chargement" />
    return <Wrapped {...(props as P)} /> // les autres props passent telles quelles
  }
  WithLoading.displayName = `WithLoading(${Wrapped.displayName ?? Wrapped.name})` // le nom affiché dans les DevTools
  return WithLoading
}
