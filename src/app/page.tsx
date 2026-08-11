import { siteConfig } from "@/config/site";
import { getUiStrings } from "@/lib/content/ui";
import { HomeHero } from "@/components/sections/HomeHero";
import { HomeStatement } from "@/components/sections/HomeStatement";
import { HomeSelectedWork } from "@/components/sections/HomeSelectedWork";
import { HomeCapabilities } from "@/components/sections/HomeCapabilities";
import { HomeClients } from "@/components/sections/HomeClients";
import { HomeClosing } from "@/components/sections/HomeClosing";

export default function HomePage() {
  const home = getUiStrings(siteConfig.locale).pages.home;

  return (
    <>
      <HomeHero content={home.hero} location={siteConfig.location} />
      <HomeStatement content={home.statement} />
      <HomeSelectedWork content={home.selectedWork} />
      <HomeCapabilities content={home.capabilities} />
      <HomeClients content={home.clients} />
      <HomeClosing content={home.closing} />
    </>
  );
}
