import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ButtonLink } from "@/components/ui/ButtonLink";

describe("ButtonLink", () => {
  it("renderiza un link con href y texto", () => {
    render(<ButtonLink href="/contact">Hablemos</ButtonLink>);
    const link = screen.getByRole("link", { name: "Hablemos" });
    expect(link).toHaveAttribute("href", "/contact");
  });
});
