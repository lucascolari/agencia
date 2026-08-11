import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NavLink } from "@/components/navigation/NavLink";

vi.mock("next/navigation", () => ({
  usePathname: () => "/work",
}));

describe("NavLink", () => {
  it("marca aria-current cuando la ruta está activa", () => {
    render(<NavLink href="/work" label="Trabajos" />);
    expect(screen.getByRole("link", { name: "Trabajos" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("no marca aria-current en rutas inactivas", () => {
    render(<NavLink href="/" label="Inicio" />);
    expect(screen.getByRole("link", { name: "Inicio" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});
