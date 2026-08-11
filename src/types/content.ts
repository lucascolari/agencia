export interface NavItem {
  label: string;
  href: string;
}

export interface PageIntroContent {
  eyebrow: string;
  title: string;
  lead: string;
}

export interface PageContent {
  meta: { title: string; description: string };
  intro: PageIntroContent;
}

export interface UiStrings {
  nav: NavItem[];
  menu: { open: string; close: string };
  footer: { rights: string };
  pages: {
    home: { intro: PageIntroContent; cta: string };
    about: PageContent;
    work: PageContent;
    contact: PageContent;
  };
}
