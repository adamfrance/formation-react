import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw/http";
import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";
import CollaboratorDetail from "./CollaboratorDetail.tsx";
import { sampleCollaborators } from "../data/collaborators.ts";
import { server } from "../mocks/server.ts";
import { store } from "../store/index.ts";

const emily = sampleCollaborators[0];

function Wrapper({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

describe("CollaboratorDetail", () => {
  it("affiche les tâches renvoyées par l'API", async () => {
    render(<CollaboratorDetail collaborator={emily} />, { wrapper: Wrapper });

    expect(screen.getByText("Chargement des tâches…")).toBeInTheDocument();
    expect(
      await screen.findByText("Préparer la réunion de rentrée"),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("affiche une erreur quand le serveur répond 500", async () => {
    server.use(
      http.get(
        "http://localhost:4000/users/:id/todos",
        () => new HttpResponse(null, { status: 500 }),
      ),
    );
    render(<CollaboratorDetail collaborator={emily} />, { wrapper: Wrapper });

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Tâches indisponibles (HTTP 500)",
    );
  });

  it("affiche une erreur quand le réseau est coupé", async () => {
    server.use(
      http.get("http://localhost:4000/users/:id/todos", () =>
        HttpResponse.error(),
      ),
    );
    render(<CollaboratorDetail collaborator={emily} />, { wrapper: Wrapper });

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Tâches indisponibles (fetch failed)",
    );
  });

  it("annonce qu'il n'y a aucune tâche", async () => {
    server.use(
      http.get("http://localhost:4000/users/:id/todos", () =>
        HttpResponse.json({ todos: [] }),
      ),
    );
    render(<CollaboratorDetail collaborator={emily} />, { wrapper: Wrapper });

    expect(await screen.findByText("Aucune tâche.")).toBeInTheDocument();
  });
});
