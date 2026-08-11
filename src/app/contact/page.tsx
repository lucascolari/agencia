import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getUiStrings } from "@/lib/content/ui";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/features/contact/ContactForm";
import { ContactChannels } from "@/features/contact/ContactChannels";

const page = getUiStrings(siteConfig.locale).pages.contact;

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
};

export default function ContactPage() {
  return (
    <section className="pt-44 pb-[var(--section-gap)] md:pt-60">
      <Container>
        <p className="text-label uppercase tracking-[0.28em] text-muted">
          {page.intro.eyebrow}
        </p>
        <h1 className="mt-8 max-w-4xl font-display text-display text-text">
          {page.intro.title}
        </h1>
        <p className="mt-10 max-w-xl text-lg leading-relaxed text-secondary">
          {page.intro.lead}
        </p>

        <div className="mt-24 grid grid-cols-1 gap-x-16 gap-y-20 border-t border-border pt-20 lg:grid-cols-[1.2fr_0.8fr]">
          <ContactForm copy={page.form} />
          <ContactChannels
            eyebrow={page.channelsEyebrow}
            channels={page.channels}
            timeLabel={page.timeLabel}
          />
        </div>
      </Container>
    </section>
  );
}
