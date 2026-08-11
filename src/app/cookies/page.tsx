import type { Metadata } from "next";
import { legalPages } from "@/lib/content/legal";
import { LegalPageView } from "@/app/(legal)/LegalPage";

const page = legalPages.cookies;

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return <LegalPageView page={page} />;
}
