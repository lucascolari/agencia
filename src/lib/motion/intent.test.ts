import { describe, expect, it } from "vitest";
import {
  addIntent,
  decayIntent,
  INTENT_THRESHOLD,
  intentConfirmed,
  intentProgress,
} from "./intent";

describe("intent accumulator", () => {
  it("suma empuje y confirma al llegar al umbral", () => {
    let v = 0;
    v = addIntent(v, 120);
    expect(intentConfirmed(v)).toBe(false);
    v = addIntent(v, 120);
    expect(intentConfirmed(v)).toBe(true);
  });

  it("ignora el empuje en dirección contraria", () => {
    expect(addIntent(50, -200)).toBe(50);
  });

  it("no se acumula más allá del tope", () => {
    expect(addIntent(0, 99999)).toBeLessThanOrEqual(INTENT_THRESHOLD * 1.2);
  });

  it("decae hacia 0 con el tiempo y nunca es negativo", () => {
    const after = decayIntent(100, 1000, 2.5);
    expect(after).toBeLessThan(100);
    expect(decayIntent(1, 100000, 2.5)).toBe(0);
  });

  it("el progreso está normalizado 0..1", () => {
    expect(intentProgress(0)).toBe(0);
    expect(intentProgress(INTENT_THRESHOLD)).toBe(1);
    expect(intentProgress(INTENT_THRESHOLD * 5)).toBe(1);
  });
});
