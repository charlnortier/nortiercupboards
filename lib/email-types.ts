/**
 * Email template types for the client template.
 * Only the templates still sent by the site.
 */

export type EmailTemplate =
  // Contact
  | "contact_form_confirmation"
  // Admin notifications
  | "admin_new_message";

// ─── Template Props ───────────────────────────────────────

export interface ContactFormConfirmationProps {
  senderName: string;
}

export interface AdminNewMessageProps {
  clientName: string;
  projectName: string;
  messagePreview: string;
  adminUrl: string;
}
