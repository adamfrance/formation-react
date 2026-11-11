import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Avatar from "./Avatar.tsx";

describe("Avatar", () => {
  it("affiche les initiales quand il n'y a pas de photo", () => {
    render(<Avatar name="Zoé Martin" />);
    expect(screen.getByText("ZM")).toBeInTheDocument();
  });

  it("affiche la photo quand une adresse est donnée", () => {
    render(
      <Avatar
        name="Emily Johnson"
        src="http://localhost:4000/icon/emilys/128"
      />,
    );
    expect(screen.getByRole("presentation")).toHaveAttribute(
      "src",
      "http://localhost:4000/icon/emilys/128",
    );
    expect(screen.queryByText("EJ")).not.toBeInTheDocument();
  });

  it("applique la taille demandée", () => {
    render(<Avatar name="Zoé Martin" size={88} />);
    expect(screen.getByText("ZM")).toHaveStyle({
      width: "88px",
      height: "88px",
    });
  });
});
