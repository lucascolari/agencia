import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "@/features/contact/ContactForm";
import { getUiStrings } from "@/lib/content/ui";

const copy = getUiStrings("es").pages.contact.form;

describe("ContactForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("no avanza del paso 1 sin elegir tipo de proyecto", async () => {
    const user = userEvent.setup();
    render(<ContactForm copy={copy} />);
    await user.click(screen.getByRole("button", { name: copy.next }));
    expect(screen.getByRole("alert")).toHaveTextContent(copy.errors.required);
  });

  it("completa el flujo y muestra el éxito", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(JSON.stringify({ ok: true })));
    const user = userEvent.setup();
    render(<ContactForm copy={copy} />);

    // Paso 1: tipo
    await user.click(
      screen.getByRole("button", {
        name: copy.steps.projectType.options[0],
      }),
    );
    await user.click(screen.getByRole("button", { name: copy.next }));

    // Paso 2: descripción
    await user.type(
      await screen.findByLabelText(copy.steps.description.legend),
      "Quiero una marca nueva.",
    );
    await user.click(screen.getByRole("button", { name: copy.next }));

    // Paso 3: datos
    await user.type(
      await screen.findByLabelText(copy.steps.details.name),
      "Lucas",
    );
    await user.type(
      screen.getByLabelText(copy.steps.details.email),
      "lucas@agencia.com",
    );
    await user.click(screen.getByRole("button", { name: copy.next }));

    // Paso 4: presupuesto + enviar
    await user.click(
      await screen.findByRole("button", {
        name: copy.steps.budget.options[0],
      }),
    );
    await user.click(screen.getByRole("button", { name: copy.submit }));

    await waitFor(() =>
      expect(screen.getByText(copy.success.title)).toBeInTheDocument(),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("valida el formato del email en el paso de datos", async () => {
    const user = userEvent.setup();
    render(<ContactForm copy={copy} />);

    await user.click(
      screen.getByRole("button", {
        name: copy.steps.projectType.options[0],
      }),
    );
    await user.click(screen.getByRole("button", { name: copy.next }));
    await user.type(
      await screen.findByLabelText(copy.steps.description.legend),
      "Texto.",
    );
    await user.click(screen.getByRole("button", { name: copy.next }));
    await user.type(
      await screen.findByLabelText(copy.steps.details.name),
      "Lucas",
    );
    await user.type(
      screen.getByLabelText(copy.steps.details.email),
      "mal-email",
    );
    await user.click(screen.getByRole("button", { name: copy.next }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      copy.errors.email,
    );
  });
});
