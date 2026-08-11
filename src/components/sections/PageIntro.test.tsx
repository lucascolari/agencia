import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageIntro } from "@/components/sections/PageIntro";

const content = {
  eyebrow: "Contacto",
  title: "Creemos algo juntos.",
  lead: "Contanos qué necesitás.",
};

describe("PageIntro", () => {
  it("renderiza eyebrow, título h1 y lead", () => {
    render(<PageIntro content={content} />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Creemos algo juntos." }),
    ).toBeInTheDocument();
    expect(screen.getByText("Contacto")).toBeInTheDocument();
    expect(screen.getByText("Contanos qué necesitás.")).toBeInTheDocument();
  });
});
