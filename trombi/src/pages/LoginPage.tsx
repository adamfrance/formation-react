import { useState } from "react";
import type { SubmitEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import Panel from "../components/Panel.tsx";
import { useAppDispatch, useAppSelector } from "../store/hooks.ts";
import { login } from "../store/authSlice.ts";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: string } | null)?.from ?? "/mon-espace";

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await dispatch(login({ username, password }));
    if (login.fulfilled.match(result)) navigate(from, { replace: true });
  };

  return (
    <div className="login">
      <Panel title="Connexion">
        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Identifiant</label>
            <input
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </div>
          {status === "failed" && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Connexion…" : "Se connecter"}
          </button>
          <p className="hint">
            Comptes de test : emilys / emilyspass (administratrice), averyp /
            averyppass.
          </p>
        </form>
      </Panel>
    </div>
  );
}

export default LoginPage;
