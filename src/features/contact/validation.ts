export interface ContactPayload {
  projectType: string;
  description: string;
  name: string;
  company: string;
  email: string;
  budget: string;
  /** Honeypot anti-spam: debe llegar vacío. */
  website?: string;
}

export type ContactField = "projectType" | "description" | "name" | "email" | "budget";

export type ContactErrors = Partial<Record<ContactField, "required" | "email">>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/** Valida los campos requeridos y el formato del email. */
export function validateContact(
  data: Partial<ContactPayload>,
): ContactErrors {
  const errors: ContactErrors = {};
  if (!data.projectType?.trim()) errors.projectType = "required";
  if (!data.description?.trim()) errors.description = "required";
  if (!data.name?.trim()) errors.name = "required";
  if (!data.budget?.trim()) errors.budget = "required";
  if (!data.email?.trim()) errors.email = "required";
  else if (!isValidEmail(data.email)) errors.email = "email";
  return errors;
}

export function hasErrors(errors: ContactErrors): boolean {
  return Object.keys(errors).length > 0;
}
