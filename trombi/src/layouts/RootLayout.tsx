import { useEffect, Suspense } from "react";
import { Outlet } from "react-router";
import Header from "../components/Header.tsx";
import { useAppDispatch } from "../store/hooks.ts";
import { fetchCollaborators } from "../store/collaboratorsSlice.ts";

function RootLayout() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCollaborators());
  }, [dispatch]);

  return (
    <div className="app">
      <Header />
      <Suspense
        fallback={
          <div
            className="spinner"
            role="status"
            aria-label="Chargement de la page"
          />
        }
      >
        <Outlet />
      </Suspense>
    </div>
  );
}

export default RootLayout;
