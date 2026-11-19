import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router'
import { ErrorBoundary } from 'react-error-boundary'
import Header from '../components/Header.tsx'
import PageError from '../components/PageError.tsx'
import { reportError } from '../monitoring.ts'

// La mise en page commune : l'en-tête, puis la page de l'adresse courante
function RootLayout() {
  const { pathname } = useLocation()

  return (
    <div className="app">
      <Header />
      {/* une erreur dans la page n'emporte que la page ; changer d'adresse efface l'erreur */}
      <ErrorBoundary FallbackComponent={PageError} resetKeys={[pathname]} onError={reportError}>
        <Suspense fallback={<div className="spinner" role="status" aria-label="Chargement de la page" />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default RootLayout
