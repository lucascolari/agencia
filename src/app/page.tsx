import { siteConfig } from "@/config/site";
import { getUiStrings } from "@/lib/content/ui";
import { PageIntro } from "@/components/sections/PageIntro";
import { ButtonLink } from "@/components/ui/ButtonLink";

export default function HomePage() {
  const ui = getUiStrings(siteConfig.locale);

  return (
    <PageIntro content={ui.pages.home.intro}>
      <ButtonLink href="/contact">{ui.pages.home.cta}</ButtonLink>
    </PageIntro>
  );
}
