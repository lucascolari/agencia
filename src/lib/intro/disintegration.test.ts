import { describe, expect, it } from "vitest";
import { DISINTEGRATION_WINDOWS, erosion } from "./disintegration";

describe("erosion", () => {
  const loc = DISINTEGRATION_WINDOWS.loc;

  it("está intacta antes de su ventana", () => {
    expect(erosion(0, loc, 0.5)).toBe(0);
    // b0 (frase principal) sigue intacta mientras erosiona el resto.
    expect(erosion(0.5, DISINTEGRATION_WINDOWS.b0, 0.5)).toBe(0);
  });

  it("está absorbida al terminar su ventana, para cualquier partícula", () => {
    for (const rand of [0, 0.3, 0.7, 1]) {
      expect(erosion(0.18, loc, rand)).toBe(1);
    }
  });

  it("es monótona creciente con el progreso", () => {
    let prev = -1;
    for (let p = 0; p <= 0.18; p += 0.02) {
      const e = erosion(p, loc, 0.4);
      expect(e).toBeGreaterThanOrEqual(prev);
      prev = e;
    }
  });

  it("partículas con distinto desfase erosionan en momentos distintos (irregular)", () => {
    const p = 0.09; // mitad de la ventana loc
    const temprana = erosion(p, loc, 0.0);
    const tardia = erosion(p, loc, 0.9);
    expect(temprana).toBeGreaterThan(tardia);
  });

  it("la frase principal (b0) es la última en empezar a erosionar", () => {
    expect(erosion(0.74, DISINTEGRATION_WINDOWS.b0, 0)).toBe(0);
    expect(erosion(0.9, DISINTEGRATION_WINDOWS.b0, 0)).toBeGreaterThan(0);
  });
});
