import { describe, expect, it } from "vitest";
import {
  alphaChannel,
  buildField,
  lerp,
  makeRng,
  samplePointsFromAlpha,
} from "./particles";

describe("makeRng", () => {
  it("es determinista para una misma semilla", () => {
    const a = makeRng(42);
    const b = makeRng(42);
    const seqA = [a(), a(), a()];
    const seqB = [b(), b(), b()];
    expect(seqA).toEqual(seqB);
  });

  it("da valores en [0,1)", () => {
    const r = makeRng(7);
    for (let i = 0; i < 50; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("samplePointsFromAlpha", () => {
  it("solo toma puntos de píxeles encendidos", () => {
    // 4x1: encendido solo el píxel de la izquierda (índice 0).
    const alpha = [255, 0, 0, 0];
    const pts = samplePointsFromAlpha(alpha, 4, 1, 20, makeRng(1));
    expect(pts.length).toBe(20);
    expect(pts.every((p) => p.x === 0 && p.y === 0)).toBe(true);
  });

  it("devuelve vacío si no hay píxeles encendidos", () => {
    const pts = samplePointsFromAlpha([0, 0, 0, 0], 2, 2, 10, makeRng(1));
    expect(pts).toEqual([]);
  });
});

describe("alphaChannel", () => {
  it("extrae el canal alpha de RGBA", () => {
    const rgba = new Uint8ClampedArray([1, 2, 3, 200, 4, 5, 6, 50]);
    expect(Array.from(alphaChannel(rgba, 2))).toEqual([200, 50]);
  });
});

describe("buildField", () => {
  it("deja el centro despejado", () => {
    const pts = buildField(200, makeRng(3), 0.16);
    const anyInCenter = pts.some(
      (p) => Math.hypot(p.x * 1.0, p.y * 1.7) < 0.16,
    );
    expect(anyInCenter).toBe(false);
  });

  it("es determinista", () => {
    expect(buildField(30, makeRng(9))).toEqual(buildField(30, makeRng(9)));
  });
});

describe("lerp", () => {
  it("interpola", () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
  });
});
