import { describe, it, expect } from "vitest";
import {
  isValidEmail,
  validateContact,
  hasErrors,
} from "@/features/contact/validation";

describe("isValidEmail", () => {
  it("acepta emails válidos", () => {
    expect(isValidEmail("lucas@agencia.com")).toBe(true);
  });
  it("rechaza emails inválidos", () => {
    expect(isValidEmail("noesunmail")).toBe(false);
    expect(isValidEmail("a@b")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});

describe("validateContact", () => {
  const valid = {
    projectType: "Branding",
    description: "Necesito una marca nueva.",
    name: "Lucas",
    company: "Estudio",
    email: "lucas@agencia.com",
    budget: "US$ 5.000 – 15.000",
  };

  it("no devuelve errores para datos válidos", () => {
    expect(hasErrors(validateContact(valid))).toBe(false);
  });

  it("marca campos requeridos faltantes", () => {
    const errors = validateContact({ ...valid, name: "", projectType: "" });
    expect(errors.name).toBe("required");
    expect(errors.projectType).toBe("required");
  });

  it("marca email con formato inválido", () => {
    expect(validateContact({ ...valid, email: "malo" }).email).toBe("email");
  });

  it("company es opcional", () => {
    expect(hasErrors(validateContact({ ...valid, company: "" }))).toBe(false);
  });
});
