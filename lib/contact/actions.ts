"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, notifyAdmin } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

export type ContactFormState = {
  success?: boolean;
  error?: string;
} | null;

// Faster than this from page load to the last input is not a person — they have
// to read, click into the message and type. Measured in the browser
// (contact-form.tsx `fill_ms`).
const MIN_FILL_MS = 3000;

/** Returns why a submission looks like a bot, or null. */
function detectSpam(formData: FormData): string | null {
  // Hidden fields a human never sees (contact-form.tsx); bots fill them.
  for (const field of ["reference_number", "subject"]) {
    if ((formData.get(field) as string | null)?.trim()) return `honeypot "${field}" filled`;
  }
  // Absent when the page ran no JavaScript or nothing was typed; only a present,
  // too-small value counts.
  const fillMs = Number(formData.get("fill_ms"));
  if (fillMs > 0 && fillMs < MIN_FILL_MS) return "filled in too fast";
  return null;
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Spam traps. A trapped submission is still SAVED — archived, so it stays out
  // of the admin inbox, with the reason prefixed — and sends no email. It is never
  // discarded: on 2026-10-05 the operator's own test vanished into the old
  // discard-on-honeypot branch, so a trap can catch a person. The sender gets
  // the same success reply either way, so a bot learns nothing.
  const spamReason = detectSpam(formData);

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const phone = (formData.get("phone") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !message) {
    return { error: "Please fill in your name, email, and message." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  // Rate limit by IP — 5 submissions per 5 minutes
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = checkRateLimit(ip, { prefix: "contact", limit: 5, windowSeconds: 300 });
  if (!rl.success) {
    return { error: "Too many submissions. Please try again in a few minutes." };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("contact_submissions").insert({
    name,
    email,
    phone: phone || "",
    message: spamReason ? `[Possible spam: ${spamReason}]\n\n${message}` : message,
    archived: Boolean(spamReason),
  });

  if (error) {
    console.error("[contact] Failed to save submission:", error);
    return { error: "Something went wrong. Please try again." };
  }

  if (spamReason) {
    console.log(`[contact] saved as possible spam (archived, no email): ${spamReason}`);
    return { success: true };
  }

  // Send confirmation + admin notification after the response. `after` keeps the
  // serverless function alive until they finish — a bare unawaited promise gets
  // frozen on Vercel and the emails are silently dropped.
  after(() =>
    Promise.all([
      sendEmail({
        to: email,
        template: "contact_form_confirmation",
        props: { senderName: name },
      }),
      notifyAdmin("admin_new_message", {
        clientName: name,
        projectName: "Contact Form",
        messagePreview: message.slice(0, 200),
        adminUrl: `${process.env.NEXT_PUBLIC_APP_URL}/admin`,
      }),
    ]).catch((err) => console.error("[email] contact_form failed:", err))
  );

  return { success: true };
}
