// Affiché tout de suite pendant que la page attend ses données : Next.js entoure la page d'un <Suspense>
export default function Loading() {
  return <div className="spinner" role="status" aria-label="Chargement de la fiche" />
}
