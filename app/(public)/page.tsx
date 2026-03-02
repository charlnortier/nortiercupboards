import { generatePageMetadata } from "@/lib/seo/metadata";
import {
  getHomepageSections,
  getSiteSettings,
  getSiteContent,
  getFeaturedPortfolioItems,
} from "@/lib/cms/queries";
import { organizationSchema } from "@/lib/seo/structured-data";
import { HomeContent } from "@/components/home/home-content";
import type { LocalizedString } from "@/types/cms";

export const revalidate = 3600;

export async function generateMetadata() {
  return generatePageMetadata("home");
}

/* ---------- Section content types ---------- */

interface HeroContent {
  heading?: LocalizedString;
  subheading?: LocalizedString;
  cta_text?: LocalizedString;
  cta_url?: string;
  cta_secondary_text?: LocalizedString;
  cta_secondary_url?: string;
  background_image?: string;
}

interface TrustStatsContent {
  items?: { icon?: string; value?: string; label?: LocalizedString }[];
}

interface ServicesContent {
  heading?: LocalizedString;
  subheading?: LocalizedString;
  items?: {
    icon?: string;
    title?: LocalizedString;
    description?: LocalizedString;
  }[];
}

interface AboutContent {
  heading?: LocalizedString;
  body?: LocalizedString;
  image?: string;
}

interface CtaContent {
  heading?: LocalizedString;
  body?: LocalizedString;
  button_text?: LocalizedString;
  button_url?: string;
}

/* ---------- Page ---------- */

export default async function HomePage() {
  const [sections, settings, trustStripContent, featuredProjects] =
    await Promise.all([
      getHomepageSections(),
      getSiteSettings(),
      getSiteContent("trust_strip"),
      getFeaturedPortfolioItems(),
    ]);

  const sectionMap = Object.fromEntries(
    sections.map((s) => [s.section_key, s.content])
  );

  const hero = sectionMap.hero as HeroContent | undefined;
  const trustStats = sectionMap.trust_stats as TrustStatsContent | undefined;
  const services = sectionMap.services as ServicesContent | undefined;
  const about = sectionMap.about as AboutContent | undefined;
  const cta = sectionMap.cta as CtaContent | undefined;

  const trustStripValues = (trustStripContent?.values ?? []) as string[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema(settings)),
        }}
      />
      <HomeContent
        hero={hero}
        trustStats={trustStats}
        services={services}
        about={about}
        cta={cta}
        trustStripValues={trustStripValues}
        featuredProjects={featuredProjects}
        settings={settings}
      />
    </>
  );
}
