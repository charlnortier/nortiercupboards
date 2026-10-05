/**
 * Unified email sender — Resend API primary, SMTP fallback.
 * Replaces Yoros's lib/resend/client.ts.
 *
 * Usage:
 *   import { sendEmail, notifyAdmin } from "@/lib/email";
 */

import { createElement } from "react";
import { Resend } from "resend";
import { render } from "@react-email/render";
import type { EmailTemplate } from "./email-types";

// Templates — lazy imports to keep bundle small
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- each template has unique props
const templates: Record<EmailTemplate, () => Promise<{ default: React.ComponentType<any> }>> = {
  contact_form_confirmation: () => import("@/components/email/contact-form-confirmation"),
  admin_new_message: () => import("@/components/email/admin-new-message"),
};

// Subject line generators
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- subject generators access varied props
const subjects: Record<EmailTemplate, (props: Record<string, any>) => string> = {
  contact_form_confirmation: (p) => `Thanks for reaching out, ${p.senderName}!`,
  admin_new_message: (p) => `New message from ${p.clientName}`,
};

// ─── Resend Instance ──────────────────────────────────────

const FROM_ADDRESS = process.env.RESEND_FROM || "noreply@example.com";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";

// ─── Send Function ────────────────────────────────────────

interface SendEmailOptions {
  to: string | string[];
  template: EmailTemplate;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- template props vary per template
  props: Record<string, any>;
  replyTo?: string;
}

export async function sendEmail({
  to,
  template,
  props,
  replyTo,
}: SendEmailOptions) {
  try {
    const mod = await templates[template]();
    const EmailComponent = mod.default;
    const html = await render(createElement(EmailComponent, props));
    const subject = subjects[template](props);
    const recipients = Array.isArray(to) ? to : [to];

    // Try Resend first
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: recipients,
        subject,
        html,
        replyTo,
      });

      if (error) {
        console.error(`[Email] Resend failed for ${template}:`, error);
        // Fall through to SMTP if available
        if (!process.env.SMTP_HOST) {
          return { success: false, error };
        }
      } else {
        console.log(`[Email] Sent ${template} to ${to} via Resend — id: ${data?.id}`);
        return { success: true, id: data?.id };
      }
    }

    // SMTP fallback
    if (process.env.SMTP_HOST) {
      const nodemailer = await import("nodemailer");
      const transport = nodemailer.default.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transport.sendMail({
        from: FROM_ADDRESS,
        to: recipients.join(", "),
        subject,
        html,
        replyTo,
      });

      console.log(`[Email] Sent ${template} to ${to} via SMTP`);
      return { success: true };
    }

    throw new Error("No email provider configured — set RESEND_API_KEY or SMTP_HOST");
  } catch (err) {
    console.error(`[Email] Exception sending ${template}:`, err);
    return { success: false, error: err };
  }
}

// ─── Send Raw HTML Email (for DB-backed templates) ───────

interface SendRawEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendRawEmail({ to, subject, html, replyTo }: SendRawEmailOptions) {
  const recipients = Array.isArray(to) ? to : [to];

  try {
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: recipients,
        subject,
        html,
        replyTo,
      });

      if (error) {
        console.error("[Email] Resend failed for raw email:", error);
        if (!process.env.SMTP_HOST) return { success: false, error };
      } else {
        console.log(`[Email] Sent raw email to ${to} via Resend — id: ${data?.id}`);
        return { success: true, id: data?.id };
      }
    }

    if (process.env.SMTP_HOST) {
      const nodemailer = await import("nodemailer");
      const transport = nodemailer.default.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      await transport.sendMail({
        from: FROM_ADDRESS,
        to: recipients.join(", "),
        subject,
        html,
        replyTo,
      });

      console.log(`[Email] Sent raw email to ${to} via SMTP`);
      return { success: true };
    }

    throw new Error("No email provider configured");
  } catch (err) {
    console.error("[Email] Exception sending raw email:", err);
    return { success: false, error: err };
  }
}

// ─── Convenience: Send Admin Notification ─────────────────

export async function notifyAdmin(
  template: EmailTemplate,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- template props vary per template
  props: Record<string, any>
) {
  return sendEmail({
    to: ADMIN_EMAIL,
    template,
    props,
  });
}
