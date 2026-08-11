import { NextResponse } from "next/server";
import {
  validateContact,
  hasErrors,
  type ContactPayload,
} from "@/features/contact/validation";

/**
 * Endpoint del formulario de contacto. Valida del lado del servidor y descarta
 * envíos con el honeypot lleno (spam). La persistencia/envío de email real se
 * conecta en la fase de hardening (fase 7) con credenciales.
 */
export async function POST(request: Request) {
  let data: Partial<ContactPayload>;
  try {
    data = (await request.json()) as Partial<ContactPayload>;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Honeypot: si viene lleno, es un bot. Respondemos ok para no darle pistas.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  const errors = validateContact(data);
  if (hasErrors(errors)) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  return NextResponse.json({ ok: true });
}
