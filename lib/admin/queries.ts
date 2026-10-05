import { createAdminClient } from "@/lib/supabase/admin";
import type { ContactSubmission, ActivityLogEntry } from "@/types";

// ---------- Dashboard Stats ----------

export interface DashboardStats {
  contactCount: number;
  unreadContactCount: number;
  portfolioCount: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const admin = createAdminClient();

  const [contactRes, unreadRes, portfolioRes] =
    await Promise.all([
      admin
        .from("contact_submissions")
        .select("id", { count: "exact", head: true })
        .eq("archived", false),
      admin
        .from("contact_submissions")
        .select("id", { count: "exact", head: true })
        .eq("read", false)
        .eq("archived", false),
      admin
        .from("portfolio_items")
        .select("id", { count: "exact", head: true })
        .eq("is_published", true)
        .is("deleted_at", null),
    ]);

  return {
    contactCount: contactRes.count ?? 0,
    unreadContactCount: unreadRes.count ?? 0,
    portfolioCount: portfolioRes.count ?? 0,
  };
}

// ---------- Contact Submissions ----------

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("contact_submissions")
    .select("*")
    .eq("archived", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getContactSubmissions]", error.message);
    return [];
  }
  return (data ?? []) as ContactSubmission[];
}

// ---------- Portfolio Items (Admin) ----------

// ---------- Activity Log ----------

export async function getActivityLog(limit = 50): Promise<ActivityLogEntry[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getActivityLog]", error.message);
    return [];
  }
  return (data ?? []) as ActivityLogEntry[];
}

// ---------- Cron Runs ----------

export interface CronRun {
  id: string;
  task_name: string;
  status: "success" | "error" | "skipped";
  summary: Record<string, unknown>;
  duration_ms: number | null;
  created_at: string;
}

/** Get the most recent run for each task */
export async function getLastCronRuns(): Promise<CronRun[]> {
  const admin = createAdminClient();
  // Get distinct task names with their latest run
  const { data, error } = await admin
    .from("cron_runs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("[getLastCronRuns]", error.message);
    return [];
  }

  // Deduplicate to latest per task
  const seen = new Set<string>();
  const latest: CronRun[] = [];
  for (const run of (data ?? []) as CronRun[]) {
    if (!seen.has(run.task_name)) {
      seen.add(run.task_name);
      latest.push(run);
    }
  }
  return latest;
}

// ---------- Site Settings ----------
