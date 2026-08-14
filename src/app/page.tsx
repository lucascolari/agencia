import { siteConfig } from "@/config/site";
import { getUiStrings } from "@/lib/content/ui";
import { HomeHero } from "@/components/sections/HomeHero";
import { HomeStatement } from "@/components/sections/HomeStatement";
import { SelectedWork3D } from "@/components/3d/SelectedWork3D";
import { HomeCapabilities } from "@/components/sections/HomeCapabilities";
import { HomeClients } from "@/components/sections/HomeClients";
import { ClosingCta } from "@/components/sections/ClosingCta";

export default function HomePage() {
  const home = getUiStrings(siteConfig.locale).pages.home;

  return (
    <>
      <HomeHero content={home.hero} location={siteConfig.location} />
      <HomeStatement content={home.statement} />
      <SelectedWork3D content={home.selectedWork} />
      <HomeCapabilities content={home.capabilities} />
      <HomeClients content={home.clients} />
      <ClosingCta content={home.closing} />
    </>
  );
}
