import { Suspense, useEffect } from 'react'
import { Outlet } from 'react-router'
import Header from '../components/Header.tsx'
import { useAppDispatch } from '../store/hooks.ts'
import { fetchCollaborators } from '../store/collaboratorsSlice.ts'

// La mise en page commune : l'en-tête, puis la page de l'adresse courante
function RootLayout() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchCollaborators()) // chargés une fois, pour toutes les pages
  }, [dispatch])

  return (
    <div className="app">
      <Header />
      <Suspense fallback={<div className="spinner" role="status" aria-label="Chargement de la page" />}>
        <Outlet />
      </Suspense>
    </div>
  )
}

export default RootLayout
