"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";

// ---------- Admin Notification Preferences ----------

// ---------- Mark Contact Submission Read ----------

export async function markContactRead(
  id: string
): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return { error: auth.error };

  const admin = createAdminClient();
  const { error } = await admin
    .from("contact_submissions")
    .update({ read: true, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin");
  return {};
}

// ---------- Archive Contact Submission ----------

export async function archiveContact(
  id: string
): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return { error: auth.error };

  const admin = createAdminClient();
  const { error } = await admin
    .from("contact_submissions")
    .update({ archived: true, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin");
  return {};
}

// ---------- Update Project URLs ----------

// ---------- Update Site Settings ----------

export async function updateSiteSettings(
  settings: Record<string, unknown>
): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return { error: auth.error };

  const admin = createAdminClient();
  const { error } = await admin.from("site_content").upsert(
    {
      section_key: "site_settings",
      content: settings,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "section_key" }
  );

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return {};
}
