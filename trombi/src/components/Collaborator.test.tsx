import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import CollaboratorCard from "./CollaboratorCard.tsx";
import { sampleCollaborators } from "../data/collaborators.ts";

const emily = sampleCollaborators[0];

describe("CollaboratorCard", () => {
  it("affiche le nom en lien vers la fiche, le poste et le badge", () => {
    render(
      <CollaboratorCard collaborator={emily} onToggleFavorite={vi.fn()} />,
      { wrapper: MemoryRouter },
    );
    expect(screen.getByRole("link", { name: "Emily Johnson" })).toHaveAttribute(
      "href",
      "/annuaire/1",
    );
    expect(screen.getByText("Sales Manager")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("prévient le parent au clic sur l'étoile", async () => {
    const user = userEvent.setup();
    const onToggleFavorite = vi.fn();
    render(
      <CollaboratorCard
        collaborator={emily}
        onToggleFavorite={onToggleFavorite}
      />,
      { wrapper: MemoryRouter },
    );
    const star = screen.getByRole("button", {
      name: "Emily Johnson en favori",
    });
    expect(star).toHaveAttribute("aria-pressed", "false");

    await user.click(star);

    expect(onToggleFavorite).toHaveBeenCalledWith(1);
  });
});
