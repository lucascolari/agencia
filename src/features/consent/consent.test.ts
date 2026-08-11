import { describe, it, expect } from "vitest";
import {
  readConsent,
  writeConsent,
  CONSENT_KEY,
  type ConsentState,
} from "@/features/consent/consent";

function fakeStorage(initial: Record<string, string> = {}) {
  const store = { ...initial };
  return {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => {
      store[k] = v;
    },
    store,
  };
}

describe("consent", () => {
  it("devuelve null si no hay elección guardada", () => {
    expect(readConsent(fakeStorage())).toBeNull();
  });

  it("lee la elección guardada forzando necessary=true", () => {
    const s = fakeStorage({
      [CONSENT_KEY]: JSON.stringify({ analytics: true, marketing: false }),
    });
    const consent = readConsent(s);
    expect(consent).toEqual({
      necessary: true,
      analytics: true,
      marketing: false,
    });
  });

  it("escribe y relee de forma consistente", () => {
    const s = fakeStorage();
    const state: ConsentState = {
      necessary: true,
      analytics: false,
      marketing: true,
    };
    writeConsent(s, state);
    expect(readConsent(s)).toEqual(state);
  });

  it("no explota con JSON corrupto", () => {
    const s = fakeStorage({ [CONSENT_KEY]: "no-es-json" });
    expect(readConsent(s)).toBeNull();
  });
});
