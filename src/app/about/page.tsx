import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getUiStrings } from "@/lib/content/ui";
import { Container } from "@/components/ui/Container";
import { AboutMission } from "@/components/sections/AboutMission";
import { AboutBeliefs } from "@/components/sections/AboutBeliefs";
import { AboutCulture } from "@/components/sections/AboutCulture";
import { AboutWow } from "@/components/sections/AboutWow";
import { ClosingCta } from "@/components/sections/ClosingCta";

const page = getUiStrings(siteConfig.locale).pages.about;

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
};

export default function AboutPage() {
  return (
    <>
      <section className="pt-44 pb-16 md:pt-60 md:pb-24">
        <Container>
          <p className="text-label uppercase tracking-[0.28em] text-muted">
            {page.intro.eyebrow}
          </p>
          <h1 className="mt-8 max-w-5xl font-display text-display text-text">
            {page.intro.title}
          </h1>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-secondary">
            {page.intro.lead}
          </p>
        </Container>
      </section>

      <AboutMission content={page.mission} />
      <AboutBeliefs content={page.beliefs} />
      <AboutWow eyebrow={page.wow.eyebrow} headline={page.wow.headline} />
      <AboutCulture content={page.culture} />
      <ClosingCta content={page.closing} />
    </>
  );
}
