import { Link } from "next-view-transitions";
import { siteConfig } from "@/config/site";
import { getUiStrings } from "@/lib/content/ui";
import { Container } from "@/components/ui/Container";
import { NavLink } from "./NavLink";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const ui = getUiStrings(siteConfig.locale);

  return (
    <header className="fixed inset-x-0 top-0 z-[var(--z-navigation)]">
      <Container className="flex h-20 items-center justify-between">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-[0.08em] text-text"
        >
          {siteConfig.name}
        </Link>
        <nav
          aria-label="Principal"
          className="hidden items-center gap-10 text-label uppercase tracking-[0.2em] md:flex"
        >
          {ui.nav.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
        <MobileMenu items={ui.nav} labels={ui.menu} brand={siteConfig.name} />
      </Container>
    </header>
  );
}
