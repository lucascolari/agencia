import { siteConfig } from "@/config/site";
import { getUiStrings } from "@/lib/content/ui";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const ui = getUiStrings(siteConfig.locale);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-12">
      <Container className="flex flex-col gap-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>{siteConfig.location}</p>
        <nav
          aria-label="Redes"
          className="flex gap-8 text-label uppercase tracking-[0.2em]"
        >
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noreferrer"
            className="transition-colors duration-[var(--duration-fast)] hover:text-text"
          >
            Instagram
          </a>
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="transition-colors duration-[var(--duration-fast)] hover:text-text"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="transition-colors duration-[var(--duration-fast)] hover:text-text"
          >
            Email
          </a>
        </nav>
        <p>
          © {year} {siteConfig.name} — {ui.footer.rights}
        </p>
      </Container>
    </footer>
  );
}
