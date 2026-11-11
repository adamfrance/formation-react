import { lazy } from "react";
import { Route, Routes } from "react-router";
import RootLayout from "./layouts/RootLayout.tsx";
import HomePage from "./pages/HomePage.tsx";
import DirectoryPage from "./pages/DirectoryPage.tsx";
import RequireAuth from "./components/RequireAuth.tsx";


const CollaboratorPage = lazy(() => import("./pages/CollaboratorPage.tsx"));
const TeamPage = lazy(() => import("./pages/TeamPage.tsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.tsx"));
const AdminPage = lazy(() => import("./pages/AdminPage.tsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.tsx"));
const AccountLayout = lazy(() => import("./pages/account/AccountLayout.tsx"));
const ProfilePage = lazy(() => import("./pages/account/ProfilePage.tsx"));
const MyTasksPage = lazy(() => import("./pages/account/MyTasksPage.tsx"));

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="annuaire" element={<DirectoryPage />} />
        <Route path="annuaire/:id" element={<CollaboratorPage />} />
        <Route path="equipe" element={<TeamPage />} />
        <Route path="connexion" element={<LoginPage />} />
        <Route
          path="mon-espace"
          element={
            <RequireAuth>
              <AccountLayout />
            </RequireAuth>
          }
        >
          <Route index element={<ProfilePage />} />
          <Route path="taches" element={<MyTasksPage />} />
        </Route>
        <Route
          path="admin"
          element={
            <RequireAuth role="admin">
              <AdminPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
