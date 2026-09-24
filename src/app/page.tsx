import { siteConfig } from "@/config/site";
import { getUiStrings } from "@/lib/content/ui";
import { GularIntro } from "@/components/intro/GularIntro";
import { HomeStatement } from "@/components/sections/HomeStatement";
import { SelectedWorkScroll } from "@/components/3d/SelectedWorkScroll";
import { HomeCapabilities } from "@/components/sections/HomeCapabilities";
import { HomeClients } from "@/components/sections/HomeClients";
import { ClosingCta } from "@/components/sections/ClosingCta";

export default function HomePage() {
  const home = getUiStrings(siteConfig.locale).pages.home;

  return (
    <>
      {/* Primera pantalla: intro ceremonial + manifiesto (spec del diseñador). */}
      <GularIntro />
      {/* El resto del sitio sigue con los videos y fotos actuales. */}
      <HomeStatement content={home.statement} />
      <SelectedWorkScroll content={home.selectedWork} />
      <HomeCapabilities content={home.capabilities} />
      <HomeClients content={home.clients} />
      <ClosingCta content={home.closing} />
    </>
  );
}
