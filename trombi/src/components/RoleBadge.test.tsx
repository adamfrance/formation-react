import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RoleBadge from "./RoleBadge.tsx";

describe("RoleBadge", () => {
  it("affiche « Admin » pour un administrateur", () => {
    render(<RoleBadge role="admin" />);
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("affiche « Modérateur » pour un modérateur", () => {
    render(<RoleBadge role="moderator" />);
    expect(screen.getByText("Modérateur")).toBeInTheDocument();
  });

  it("n'affiche rien pour un utilisateur", () => {
    const { container } = render(<RoleBadge role="user" />);
    expect(container).toBeEmptyDOMElement();
  });
});
