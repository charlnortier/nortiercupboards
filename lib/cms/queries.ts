import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/config/site";
import type {
  LayoutData,
  SiteSettings,
  NavLink,
  FooterSection,
  Faq,
  PageSeo,
  HomepageSection,
} from "@/types/cms";
import type { PortfolioItem } from "@/types";

const defaultSiteSettings: SiteSettings = {
  logo_text: siteConfig.name,
  company_name: siteConfig.name,
  company_tagline: { en: "", af: "" },
  login_label: { en: "Login", af: "Teken In" },
  login_url: "/login",
  cta_label: { en: "Contact Us", af: "Kontak Ons" },
  cta_url: "/contact",
};

// ---------- Layout Data ----------

export async function getLayoutData(): Promise<LayoutData> {
  const supabase = await createClient();

  const [{ data: settingsRow }, { data: navLinks }, { data: footerSections }] =
    await Promise.all([
      supabase
        .from("site_content")
        .select("content")
        .eq("section_key", "site_settings")
        .single(),
      supabase
        .from("nav_links")
        .select("*")
        .eq("is_active", true)
        .order("display_order"),
      supabase
        .from("footer_sections")
        .select("*")
        .eq("is_active", true)
        .order("display_order"),
    ]);

  return {
    siteSettings: (settingsRow?.content as SiteSettings) ?? defaultSiteSettings,
    navLinks: (navLinks as NavLink[]) ?? [],
    footerSections: (footerSections as FooterSection[]) ?? [],
  };
}

// ---------- Site Content (generic) ----------

export async function getSiteContent(
  sectionKey: string
): Promise<Record<string, unknown> | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_content")
    .select("content")
    .eq("section_key", sectionKey)
    .single();
  return (data?.content as Record<string, unknown>) ?? null;
}

// ---------- Site Settings ----------

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_content")
    .select("content")
    .eq("section_key", "site_settings")
    .single();
  return (data?.content as SiteSettings) ?? defaultSiteSettings;
}

// ---------- Homepage Sections ----------

export async function getHomepageSections(): Promise<HomepageSection[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("homepage_sections")
    .select("*")
    .eq("is_active", true)
    .order("display_order");
  return (data as HomepageSection[]) ?? [];
}

// ---------- FAQ ----------

export async function getFaqs(): Promise<Faq[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_active", true)
    .order("display_order");
  return (data as Faq[]) ?? [];
}

// ---------- Legal Documents ----------

export async function getLegalDocumentBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("legal_documents")
    .select("title, slug, content, version, updated_at")
    .eq("slug", slug)
    .eq("active", true)
    .single();
  return data;
}

// ---------- Page SEO ----------

export async function getPageSeo(pageKey: string): Promise<PageSeo | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_seo")
    .select("*")
    .eq("page_key", pageKey)
    .single();
  return (data as PageSeo) ?? null;
}

// ---------- Portfolio ----------

export async function getPublishedPortfolioItems(): Promise<PortfolioItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("is_published", true)
    .is("deleted_at", null)
    .order("display_order");
  return (data as PortfolioItem[]) ?? [];
}

export async function getPortfolioItemBySlug(slug: string): Promise<PortfolioItem | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .is("deleted_at", null)
    .single();
  return (data as PortfolioItem) ?? null;
}

export async function getFeaturedPortfolioItems(): Promise<PortfolioItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .is("deleted_at", null)
    .order("display_order")
    .limit(4);
  return (data as PortfolioItem[]) ?? [];
}
