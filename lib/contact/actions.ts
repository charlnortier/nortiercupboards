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

// Faster than this from the form becoming usable to the last keystroke is not a
// person typing. Measured in the browser (contact-form.tsx `fill_ms`).
const MIN_FILL_MS = 3000;

/** Returns why a submission looks like a bot, or null. */
function detectSpam(formData: FormData): string | null {
  // Hidden fields a human never sees (contact-form.tsx); bots fill them.
  for (const field of ["website", "subject"]) {
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
  // Spam traps. A bot gets the same success reply as a person, so it learns
  // nothing; nothing is saved and no email is sent.
  const spamReason = detectSpam(formData);
  if (spamReason) {
    console.log(`[contact] spam rejected: ${spamReason}`);
    return { success: true };
  }

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
    message,
  });

  if (error) {
    console.error("[contact] Failed to save submission:", error);
    return { error: "Something went wrong. Please try again." };
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
