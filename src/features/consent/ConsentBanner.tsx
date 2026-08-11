"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { consentCopy } from "@/lib/content/legal";
import {
  readConsent,
  writeConsent,
  ACCEPT_ALL,
  DEFAULT_CONSENT,
  type ConsentState,
} from "@/features/consent/consent";
import { cn } from "@/lib/utils";

/**
 * Banner de consentimiento (spec §38). Aparece solo si el usuario todavía no
 * eligió. Las cookies no esenciales no se activan hasta que da su OK. Respeta la
 * identidad visual del sitio.
 */
export function ConsentBanner() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [choice, setChoice] = useState<ConsentState>(DEFAULT_CONSENT);

  useEffect(() => {
    // Lectura solo-cliente de localStorage para decidir si mostrar el banner.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (readConsent(window.localStorage) === null) setVisible(true);
  }, []);

  const persist = (state: ConsentState) => {
    writeConsent(window.localStorage, state);
    setVisible(false);
    // Aquí se inicializarían analytics/marketing según `state` (fase con analítica).
  };

  const cat = consentCopy.categories;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label={consentCopy.title}
          aria-modal={false}
          initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 24 }}
          transition={{ duration: reduced ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-4 bottom-4 z-[var(--z-modal)] mx-auto max-w-3xl border border-border bg-surface p-6 md:p-8"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-xl text-text">
                {consentCopy.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-secondary">
                {consentCopy.body}{" "}
                <Link
                  href="/cookies"
                  className="text-text underline underline-offset-4 transition-colors hover:text-accent"
                >
                  Política de cookies
                </Link>
                .
              </p>
            </div>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <fieldset className="mt-6 flex flex-col gap-4 border-t border-border pt-6">
                  <Row label={cat.necessary.label} desc={cat.necessary.description} checked disabled />
                  <Row
                    label={cat.analytics.label}
                    desc={cat.analytics.description}
                    checked={choice.analytics}
                    onChange={(v) => setChoice((c) => ({ ...c, analytics: v }))}
                  />
                  <Row
                    label={cat.marketing.label}
                    desc={cat.marketing.description}
                    checked={choice.marketing}
                    onChange={(v) => setChoice((c) => ({ ...c, marketing: v }))}
                  />
                </fieldset>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => persist(ACCEPT_ALL)}
              className="border border-accent bg-accent px-6 py-3 text-label uppercase tracking-[0.2em] text-inverse transition-opacity hover:opacity-90"
            >
              {consentCopy.acceptAll}
            </button>
            <button
              type="button"
              onClick={() => persist(DEFAULT_CONSENT)}
              className="border border-border px-6 py-3 text-label uppercase tracking-[0.2em] text-text transition-colors hover:border-text"
            >
              {consentCopy.rejectAll}
            </button>
            {expanded ? (
              <button
                type="button"
                onClick={() => persist({ ...choice, necessary: true })}
                className="border border-border px-6 py-3 text-label uppercase tracking-[0.2em] text-text transition-colors hover:border-text"
              >
                {consentCopy.save}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="px-6 py-3 text-label uppercase tracking-[0.2em] text-muted transition-colors hover:text-text"
              >
                {consentCopy.settings}
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Row({
  label,
  desc,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}) {
  return (
    <label
      className={cn(
        "flex items-start gap-4",
        disabled ? "opacity-60" : "cursor-pointer",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 h-4 w-4 accent-[var(--accent)]"
      />
      <span>
        <span className="text-sm text-text">{label}</span>
        <span className="block text-sm text-muted">{desc}</span>
      </span>
    </label>
  );
}
