import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App.tsx";
import { renderWithProviders } from "./test/renderWithProviders.tsx";

describe("L'annuaire", () => {
  it("charge les collaborateurs puis filtre avec la recherche", async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />, { route: "/annuaire" });

    expect(await screen.findByText("12 / 12")).toBeInTheDocument();

    await user.type(
      screen.getByRole("searchbox", { name: "Rechercher" }),
      "em",
    );

    expect(screen.getByText("2 / 12")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Emily Johnson" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Emma Miller" }),
    ).toBeInTheDocument();
  });

  it("lit le service dans l'adresse", async () => {
    renderWithProviders(<App />, { route: "/annuaire?service=Marketing" });

    expect(await screen.findByText("1 / 12")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Ava Taylor" }),
    ).toBeInTheDocument();
  });

  it("ajoute un collaborateur à l'équipe depuis l'annuaire", async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />, { route: "/annuaire?q=emily" });

    await user.click(await screen.findByRole("button", { name: "+ Équipe" }));
    await user.click(screen.getByRole("link", { name: "Équipe" }));

    expect(await screen.findByText("1 / 8 membres")).toBeInTheDocument();
    expect(screen.getByText("Emily Johnson")).toBeInTheDocument();
  });
});
