import type { Metadata } from "next";
import { legalPages } from "@/lib/content/legal";
import { LegalPageView } from "@/app/(legal)/LegalPage";

const page = legalPages.privacidad;

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
  alternates: { canonical: "/privacidad" },
};

export default function PrivacidadPage() {
  return <LegalPageView page={page} />;
}
