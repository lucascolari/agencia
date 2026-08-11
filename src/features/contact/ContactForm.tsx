"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  validateContact,
  isValidEmail,
  type ContactErrors,
  type ContactPayload,
} from "@/features/contact/validation";
import type { ContactContent } from "@/types/content";

type FormCopy = ContactContent["form"];
type Status = "idle" | "submitting" | "success" | "error";

const EMPTY: ContactPayload = {
  projectType: "",
  description: "",
  name: "",
  company: "",
  email: "",
  budget: "",
  website: "",
};

const STEP_COUNT = 4;

export function ContactForm({ copy }: { copy: FormCopy }) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ContactPayload>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const liveRef = useRef<HTMLParagraphElement>(null);

  const set = <K extends keyof ContactPayload>(
    key: K,
    value: ContactPayload[K],
  ) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  /** Valida solo los campos del paso actual antes de avanzar. */
  const validateStep = (): boolean => {
    const stepErrors: ContactErrors = {};
    if (step === 0 && !data.projectType) stepErrors.projectType = "required";
    if (step === 1 && !data.description.trim())
      stepErrors.description = "required";
    if (step === 2) {
      if (!data.name.trim()) stepErrors.name = "required";
      if (!data.email.trim()) stepErrors.email = "required";
      else if (!isValidEmail(data.email)) stepErrors.email = "email";
    }
    if (step === 3 && !data.budget) stepErrors.budget = "required";
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, STEP_COUNT - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    if (!validateStep()) return;
    const allErrors = validateContact(data);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div role="status" className="max-w-2xl">
        <h2 className="font-display text-heading text-text">
          {copy.success.title}
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-secondary">
          {copy.success.body}
        </p>
      </div>
    );
  }

  const errorText = (field: keyof ContactErrors) => {
    const code = errors[field];
    if (!code) return null;
    return (
      <p role="alert" className="mt-3 text-sm text-accent">
        {code === "email" ? copy.errors.email : copy.errors.required}
      </p>
    );
  };

  const transition = reduced
    ? { duration: 0 }
    : { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <div className="max-w-2xl">
      {/* Progreso */}
      <p ref={liveRef} className="text-label uppercase tracking-[0.2em] text-muted">
        {copy.progress} {step + 1} / {STEP_COUNT}
      </p>
      <div
        className="mt-4 h-px w-full bg-border"
        role="progressbar"
        aria-label={`${copy.progress} ${step + 1} de ${STEP_COUNT}`}
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={STEP_COUNT}
      >
        <div
          className="h-px bg-accent transition-[width] duration-[var(--duration-normal)]"
          style={{ width: `${((step + 1) / STEP_COUNT) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : -16 }}
          transition={transition}
          className="mt-14"
        >
          {step === 0 && (
            <fieldset>
              <legend className="font-display text-3xl text-text md:text-4xl">
                {copy.steps.projectType.legend}
              </legend>
              <div className="mt-10 flex flex-col gap-3">
                {copy.steps.projectType.options.map((option) => (
                  <OptionButton
                    key={option}
                    label={option}
                    selected={data.projectType === option}
                    onClick={() => set("projectType", option)}
                  />
                ))}
              </div>
              {errorText("projectType")}
            </fieldset>
          )}

          {step === 1 && (
            <div>
              <label
                htmlFor="description"
                className="font-display text-3xl text-text md:text-4xl"
              >
                {copy.steps.description.legend}
              </label>
              <textarea
                id="description"
                rows={5}
                value={data.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder={copy.steps.description.placeholder}
                aria-invalid={Boolean(errors.description)}
                className="mt-10 w-full resize-none border border-border bg-transparent p-5 text-lg text-text outline-none placeholder:text-muted focus:border-accent"
              />
              {errorText("description")}
            </div>
          )}

          {step === 2 && (
            <fieldset>
              <legend className="font-display text-3xl text-text md:text-4xl">
                {copy.steps.details.legend}
              </legend>
              <div className="mt-10 flex flex-col gap-8">
                <Field
                  id="name"
                  label={copy.steps.details.name}
                  value={data.name}
                  onChange={(v) => set("name", v)}
                  invalid={Boolean(errors.name)}
                  error={errorText("name")}
                />
                <Field
                  id="company"
                  label={copy.steps.details.company}
                  value={data.company}
                  onChange={(v) => set("company", v)}
                />
                <Field
                  id="email"
                  type="email"
                  label={copy.steps.details.email}
                  value={data.email}
                  onChange={(v) => set("email", v)}
                  invalid={Boolean(errors.email)}
                  error={errorText("email")}
                />
              </div>
            </fieldset>
          )}

          {step === 3 && (
            <fieldset>
              <legend className="font-display text-3xl text-text md:text-4xl">
                {copy.steps.budget.legend}
              </legend>
              <div className="mt-10 flex flex-col gap-3">
                {copy.steps.budget.options.map((option) => (
                  <OptionButton
                    key={option}
                    label={option}
                    selected={data.budget === option}
                    onClick={() => set("budget", option)}
                  />
                ))}
              </div>
              {errorText("budget")}
            </fieldset>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Honeypot anti-spam: oculto para humanos, tentador para bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">No completar</label>
        <input
          id="website"
          tabIndex={-1}
          autoComplete="off"
          value={data.website}
          onChange={(e) => set("website", e.target.value)}
        />
      </div>

      {/* Navegación */}
      <div className="mt-14 flex items-center justify-between">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className={cn(
            "text-label uppercase tracking-[0.22em] transition-colors duration-[var(--duration-fast)]",
            step === 0
              ? "cursor-not-allowed text-muted opacity-40"
              : "text-muted hover:text-text",
          )}
        >
          {copy.back}
        </button>

        {step < STEP_COUNT - 1 ? (
          <button
            type="button"
            onClick={next}
            className="border border-border px-7 py-4 text-label uppercase tracking-[0.22em] text-text transition-colors duration-[var(--duration-fast)] hover:border-accent hover:text-accent"
          >
            {copy.next}
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={status === "submitting"}
            className="border border-accent bg-accent px-7 py-4 text-label uppercase tracking-[0.22em] text-inverse transition-opacity duration-[var(--duration-fast)] hover:opacity-90 disabled:opacity-50"
          >
            {copy.submit}
          </button>
        )}
      </div>

      {status === "error" && (
        <p role="alert" className="mt-6 text-sm text-accent">
          {copy.errors.required}
        </p>
      )}
    </div>
  );
}

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between border px-6 py-5 text-left text-lg transition-colors duration-[var(--duration-fast)]",
        selected
          ? "border-accent text-text"
          : "border-border text-secondary hover:border-text hover:text-text",
      )}
    >
      {label}
      <span
        aria-hidden
        className={cn(
          "h-2 w-2 rounded-full transition-colors",
          selected ? "bg-accent" : "bg-transparent",
        )}
      />
    </button>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  invalid,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  invalid?: boolean;
  error?: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-label uppercase tracking-[0.2em] text-muted"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid}
        className="mt-3 w-full border-b border-border bg-transparent py-3 text-lg text-text outline-none focus:border-accent"
      />
      {error}
    </div>
  );
}
