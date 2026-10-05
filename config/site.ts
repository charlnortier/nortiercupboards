/**
 * Master site configuration — controls tier, features, branding, and locale.
 *
 * Every visible string, image, and colour comes from DB or this config.
 * The setup script (`scripts/setup.sh`) or `scripts/setup-from-yoros.ts`
 * generates this file from the project manifest.
 */

export interface SiteConfig {
  name: string;
  description: string;
  domain: string;
  tier: "brochure";
  locale: {
    default: "en" | "af";
    supported: ("en" | "af")[];
  };
  currency: string;
  timezone: string;
  brand: {
    primary: string;
    secondary: string;
    accent: string;
    dark: string;
    font: {
      heading: string;
      body: string;
    };
  };
  features: {
    portfolio: boolean;
    i18n: boolean;
    darkMode: boolean;
    whatsapp: boolean;
    googleMaps: boolean;
    seoAdvanced: boolean;
    legalDocs: boolean;
  };
  integrations: {
    googleAnalytics: boolean;
    resend: boolean;
  };
  pages: {
    home: boolean;
    about: boolean;
    services: boolean;
    contact: boolean;
    faq: boolean;
    terms: boolean;
    privacy: boolean;
  };
}

export const siteConfig: SiteConfig = {
  name: "Nortier Cupboards",
  description: "Custom cupboard design, manufacture and installation in Paarl, Western Cape. 20+ years experience.",
  domain: "nortiercupboards.co.za",
  tier: "brochure",
  locale: { default: "en", supported: ["en", "af"] },
  currency: "ZAR",
  timezone: "Africa/Johannesburg",
  brand: {
    primary: "#1B2A4A",
    secondary: "#C4A265",
    accent: "#C4A265",
    dark: "#0F1D36",
    font: { heading: "Plus Jakarta Sans", body: "Inter" },
  },
  features: {
    portfolio: true,
    i18n: true,
    darkMode: true,
    whatsapp: true,
    googleMaps: true,
    seoAdvanced: true,
    legalDocs: true,
  },
  integrations: {
    googleAnalytics: true,
    resend: true,
  },
  pages: {
    home: true,
    about: true,
    services: true,
    contact: true,
    faq: true,
    terms: true,
    privacy: true,
  },
};
