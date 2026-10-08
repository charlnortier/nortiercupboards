import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { siteConfig } from "@/config/site";
import { alertOps } from "@/lib/email";

const CRON_SECRET = process.env.CRON_SECRET;

// ─── Main handler ────────────────────────────────────────

export async function GET(request: Request) {
  // Auth: Vercel sends `Authorization: Bearer $CRON_SECRET` for cron jobs. Fails
  // closed: with the secret unset this endpoint used to run for any GET.
  if (!CRON_SECRET) {
    console.error("[cron] CRON_SECRET is unset — refusing to run");
    return NextResponse.json({ error: "Cron not configured" }, { status: 503 });
  }
  if (request.headers.get("authorization") !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const runStart = Date.now();
  const tasks: Record<string, TaskResult> = {};

  // Run all tasks sequentially, each independently try/caught
  tasks.cleanup = await runTask("cleanup", () => staleContactCleanup(supabase));
  tasks.sitemap = await runTask("sitemap", () => sitemapPing(supabase));
  tasks.cronCleanup = await runTask("cron_cleanup", () => cronLogCleanup(supabase));

  // Log each task result to cron_runs
  const totalDuration = Date.now() - runStart;
  for (const [name, result] of Object.entries(tasks)) {
    await supabase.from("cron_runs").insert({
      task_name: name,
      status: result.status,
      summary: result.summary,
      duration_ms: result.durationMs,
    });
  }

  // Tell the developer when something needs them — and only then. A clean run
  // sends nothing; before this, a failed task was a cron_runs row nobody read.
  const failed = Object.entries(tasks).filter(([, r]) => r.status === "error");
  const missingEnv = REQUIRED_ENV.filter((name) => !process.env[name]);
  if (failed.length > 0 || missingEnv.length > 0) {
    // Awaited, not fire-and-forget: Vercel drops an un-awaited send (M-001).
    await alertOps("daily check needs attention", [
      ...failed.map(([name, r]) => `Task ${name} failed: ${String(r.summary.error ?? "unknown error")}`),
      ...missingEnv.map((name) => `Env var ${name} is not set in Vercel`),
    ]);
  }

  return NextResponse.json({
    ok: true,
    durationMs: totalDuration,
    tasks,
    missingEnv,
  });
}

// Env vars the site needs to deliver a lead. CRON_SECRET is not listed: without
// it this route refuses to run, so it could never report its own absence.
const REQUIRED_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "RESEND_API_KEY",
  "RESEND_FROM",
  "ADMIN_EMAIL",
  "NEXT_PUBLIC_APP_URL",
];

// ─── Task runner ─────────────────────────────────────────

interface TaskResult {
  status: "success" | "error" | "skipped";
  summary: Record<string, unknown>;
  durationMs: number;
}

async function runTask(
  name: string,
  fn: () => Promise<{ status?: "skipped"; summary: Record<string, unknown> }>
): Promise<TaskResult> {
  const start = Date.now();
  try {
    const result = await fn();
    return {
      status: result.status === "skipped" ? "skipped" : "success",
      summary: result.summary,
      durationMs: Date.now() - start,
    };
  } catch (err) {
    console.error(`[cron] Task ${name} failed:`, err);
    return {
      status: "error",
      summary: { error: err instanceof Error ? err.message : String(err) },
      durationMs: Date.now() - start,
    };
  }
}

// ─── Task: Stale contact cleanup ─────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function staleContactCleanup(supabase: any) {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

  // Archive read contact submissions older than 90 days
  const { count: archived } = await supabase
    .from("contact_submissions")
    .update({ archived: true, updated_at: new Date().toISOString() })
    .eq("read", true)
    .eq("archived", false)
    .lt("created_at", ninetyDaysAgo)
    .select("id", { count: "exact", head: true });

  return {
    summary: {
      contactsArchived: archived ?? 0,
    },
  };
}

// ─── Task: Sitemap ping ─────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sitemapPing(supabase: any) {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Check if any content was updated in the last 24 hours
  const { count } = await supabase
    .from("portfolio_items")
    .select("id", { count: "exact", head: true })
    .gt("updated_at", oneDayAgo);
  const hasUpdates = (count ?? 0) > 0;

  if (!hasUpdates) {
    return { summary: { pinged: false, reason: "no recent updates" } };
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || `https://${siteConfig.domain}`;
  const sitemapUrl = `${siteUrl}/sitemap.xml`;

  try {
    const googleUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    const res = await fetch(googleUrl, { method: "GET" });
    return {
      summary: { pinged: true, googleStatus: res.status },
    };
  } catch (err) {
    return {
      summary: {
        pinged: false,
        error: err instanceof Error ? err.message : "Ping failed",
      },
    };
  }
}

// ─── Task: Cron log cleanup ─────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function cronLogCleanup(supabase: any) {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

  const { count: deleted } = await supabase
    .from("cron_runs")
    .delete()
    .lt("created_at", ninetyDaysAgo)
    .select("id", { count: "exact", head: true });

  return {
    summary: { oldRunsDeleted: deleted ?? 0 },
  };
}
