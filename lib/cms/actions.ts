"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { LocalizedString } from "@/types/cms";
import { ensureAdmin } from "@/lib/admin/auth";

// ---- site_content ----

export async function updateSiteContent(
  sectionKey: string,
  content: Record<string, unknown>
) {
  await ensureAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("site_content")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("section_key", sectionKey);

  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function upsertSiteContent(
  sectionKey: string,
  content: Record<string, unknown>
) {
  await ensureAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("site_content").upsert(
    {
      section_key: sectionKey,
      content,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "section_key" }
  );

  if (error) throw new Error(error.message);
  revalidatePath("/");
}

// ---- nav_links ----

export async function upsertNavLink(data: {
  id?: string;
  label: LocalizedString;
  href: string;
  display_order: number;
  is_active: boolean;
}) {
  await ensureAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("nav_links").upsert({
    ...data,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function deleteNavLink(id: string) {
  await ensureAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("nav_links").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function reorderNavLinks(orderedIds: string[]) {
  await ensureAdmin();
  const supabase = createAdminClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("nav_links").update({ display_order: index }).eq("id", id)
    )
  );
  revalidatePath("/");
}

// ---- footer_sections ----

export async function upsertFooterSection(data: {
  id?: string;
  title: LocalizedString;
  links: { label: LocalizedString; href: string }[];
  display_order: number;
  is_active: boolean;
}) {
  await ensureAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("footer_sections").upsert({
    ...data,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function deleteFooterSection(id: string) {
  await ensureAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("footer_sections")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

// ---- portfolio_items ----

export async function upsertPortfolioItem(data: {
  id?: string;
  slug: string;
  title: LocalizedString;
  description?: LocalizedString;
  hero_image_url?: string | null;
  images?: string[];
  alt_text?: LocalizedString | null;
  industry?: string | null;
  features?: LocalizedString[];
  tech_stack?: string[];
  live_url?: string | null;
  is_featured?: boolean;
  display_order?: number;
  is_published?: boolean;
}) {
  await ensureAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("portfolio_items").upsert({
    ...data,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/portfolio");
  revalidatePath("/admin/portfolio");
}

/** Soft-delete a portfolio item (sets deleted_at) */
export async function deletePortfolioItem(id: string) {
  await ensureAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("portfolio_items")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/portfolio");
  revalidatePath("/admin/portfolio");
}

// ---- faqs ----

export async function upsertFaq(data: {
  id?: string;
  question: LocalizedString;
  answer: LocalizedString;
  display_order: number;
  is_active: boolean;
}) {
  await ensureAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("faqs").upsert({
    ...data,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function deleteFaq(id: string) {
  await ensureAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
}
