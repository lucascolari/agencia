import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getUiStrings } from "@/lib/content/ui";
import { PageIntro } from "@/components/sections/PageIntro";

const page = getUiStrings(siteConfig.locale).pages.work;

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
};

export default function WorkPage() {
  return <PageIntro content={page.intro} />;
}
