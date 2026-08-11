import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MobileMenu } from "@/components/navigation/MobileMenu";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

const props = {
  items: [
    { label: "Inicio", href: "/" },
    { label: "Contacto", href: "/contact" },
  ],
  labels: { open: "Menú", close: "Cerrar" },
  brand: "AGENCIA",
};

describe("MobileMenu", () => {
  it("abre el overlay y muestra la navegación", async () => {
    const user = userEvent.setup();
    render(<MobileMenu {...props} />);
    await user.click(screen.getByRole("button", { name: "Menú" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contacto" })).toBeInTheDocument();
  });

  it("cierra con el botón Cerrar", async () => {
    const user = userEvent.setup();
    render(<MobileMenu {...props} />);
    await user.click(screen.getByRole("button", { name: "Menú" }));
    await user.click(screen.getByRole("button", { name: "Cerrar" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("cierra con Escape", async () => {
    const user = userEvent.setup();
    render(<MobileMenu {...props} />);
    await user.click(screen.getByRole("button", { name: "Menú" }));
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });
});
