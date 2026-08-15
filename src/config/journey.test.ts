import { describe, expect, it } from "vitest";
import { getNext, getPrev, isInJourney } from "./journey";

describe("journey", () => {
  it("sigue el orden del menú", () => {
    expect(getNext("/")?.href).toBe("/work");
    expect(getNext("/work")?.href).toBe("/about");
    expect(getNext("/about")?.href).toBe("/contact");
  });

  it("es un anillo: Contacto vuelve a Inicio y Inicio va a Contacto", () => {
    expect(getNext("/contact")?.href).toBe("/");
    expect(getPrev("/")?.href).toBe("/contact");
  });

  it("retrocede en orden inverso", () => {
    expect(getPrev("/about")?.href).toBe("/work");
    expect(getPrev("/work")?.href).toBe("/");
  });

  it("un caso de estudio toma el lugar de /work", () => {
    expect(getNext("/work/aperol")?.href).toBe("/about");
    expect(getPrev("/work/aperol")?.href).toBe("/work");
    expect(isInJourney("/work/aperol")).toBe(true);
  });

  it("ignora el trailing slash", () => {
    expect(getNext("/work/")?.href).toBe("/about");
  });

  it("deja fuera del recorrido a las páginas legales", () => {
    expect(getNext("/cookies")).toBeNull();
    expect(getPrev("/privacidad")).toBeNull();
    expect(isInJourney("/terminos")).toBe(false);
  });
});
