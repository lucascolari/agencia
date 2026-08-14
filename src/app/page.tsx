import { siteConfig } from "@/config/site";
import { getUiStrings } from "@/lib/content/ui";
import { HomeHero } from "@/components/sections/HomeHero";
import { HomeStatement } from "@/components/sections/HomeStatement";
import { SelectedWorkScroll } from "@/components/3d/SelectedWorkScroll";
import { HomeCapabilities } from "@/components/sections/HomeCapabilities";
import { HomeClients } from "@/components/sections/HomeClients";
import { ClosingCta } from "@/components/sections/ClosingCta";

export default function HomePage() {
  const home = getUiStrings(siteConfig.locale).pages.home;

  return (
    <>
      <HomeHero content={home.hero} location={siteConfig.location} />
      <HomeStatement content={home.statement} />
      <SelectedWorkScroll content={home.selectedWork} />
      <HomeCapabilities content={home.capabilities} />
      <HomeClients content={home.clients} />
      <ClosingCta content={home.closing} />
    </>
  );
}
