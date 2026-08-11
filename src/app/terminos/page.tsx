import type { Metadata } from "next";
import { legalPages } from "@/lib/content/legal";
import { LegalPageView } from "@/app/(legal)/LegalPage";

const page = legalPages.terminos;

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
  alternates: { canonical: "/terminos" },
};

export default function TerminosPage() {
  return <LegalPageView page={page} />;
}
