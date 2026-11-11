import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import NewCollaboratorForm from "./NewCollaboratorForm.tsx";

describe("NewCollaboratorForm", () => {
  it("garde le bouton inactif tant que le formulaire est invalide", () => {
    render(
      <NewCollaboratorForm departments={["Engineering"]} onAdd={vi.fn()} />,
    );
    expect(
      screen.getByRole("button", { name: "Ajouter à l'annuaire" }),
    ).toBeDisabled();
  });

  it("affiche une erreur quand on quitte un champ invalide", async () => {
    const user = userEvent.setup();
    render(
      <NewCollaboratorForm departments={["Engineering"]} onAdd={vi.fn()} />,
    );

    await user.type(screen.getByLabelText("E-mail"), "zoe.martin@");
    await user.tab();

    expect(screen.getByText("Format d'e-mail invalide")).toBeInTheDocument();
  });

  it("envoie le nouveau collaborateur puis vide le formulaire", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<NewCollaboratorForm departments={["Engineering"]} onAdd={onAdd} />);

    await user.type(screen.getByLabelText("Prénom"), "Zoé");
    await user.type(screen.getByLabelText("Nom"), "Martin");
    await user.type(screen.getByLabelText("E-mail"), "zoe.martin@exemple.fr");
    await user.selectOptions(screen.getByLabelText("Service"), "Engineering");
    await user.type(screen.getByLabelText("Poste"), "Développeuse React");
    await user.click(
      screen.getByRole("button", { name: "Ajouter à l'annuaire" }),
    );

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: "Zoé",
        company: { department: "Engineering", title: "Développeuse React" },
      }),
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Zoé Martin a rejoint l'annuaire.",
    );
    expect(screen.getByLabelText("Prénom")).toHaveValue("");
  });
});
