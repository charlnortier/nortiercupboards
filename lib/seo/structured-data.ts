import { siteConfig } from "@/config/site";
import type { SiteSettings } from "@/types/cms";
import type { Faq } from "@/types/cms";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || `https://${siteConfig.domain}`;

// ─── Base Schemas (always available) ─────────────────────────

/** Organization schema — homepage */
export function organizationSchema(settings: SiteSettings) {
  const socialUrls =
    settings.social_links?.map((l) => l.url).filter(Boolean) ?? [];

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.company_name || siteConfig.name,
    url: BASE_URL,
    ...(socialUrls.length > 0 ? { sameAs: socialUrls } : {}),
  };
}

/** LocalBusiness schema — contact page */
export function localBusinessSchema(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.company_name || siteConfig.name,
    url: BASE_URL,
    ...(settings.phone_number ? { telephone: settings.phone_number } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: settings.address,
            addressCountry: "ZA",
          },
        }
      : {}),
    ...(settings.business_hours
      ? { openingHours: settings.business_hours }
      : {}),
    ...(settings.google_maps_coordinates
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: settings.google_maps_coordinates.lat,
            longitude: settings.google_maps_coordinates.lng,
          },
        }
      : {}),
  };
}

/** FAQPage schema — FAQ page */
export function faqPageSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question.en,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer.en,
      },
    })),
  };
}

// ─── Advanced Schemas (seoAdvanced) ──────────────────────────
