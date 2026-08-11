export interface ConsentState {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

export const CONSENT_KEY = "agencia-consent";

export const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export const ACCEPT_ALL: ConsentState = {
  necessary: true,
  analytics: true,
  marketing: true,
};

/** Lee la elección guardada; devuelve null si el usuario todavía no eligió. */
export function readConsent(
  storage: Pick<Storage, "getItem">,
): ConsentState | null {
  try {
    const raw = storage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
    };
  } catch {
    return null;
  }
}

export function writeConsent(
  storage: Pick<Storage, "setItem">,
  state: ConsentState,
): void {
  storage.setItem(CONSENT_KEY, JSON.stringify(state));
}
