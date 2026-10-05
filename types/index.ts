/**
 * Shared TypeScript types for the client template.
 * Stripped of Yoros-specific types (quotes, milestones, onboarding, reviews, etc.)
 */

// ─── Auth & Users ─────────────────────────────────────────

export interface UserProfile {
  id: string;
  role: string;
  full_name: string;
  phone: string;
  business_name: string;
  avatar_url: string | null;
  notification_prefs: { email: boolean; sms: boolean };
  email: string;
  // Extended profile fields (from 017_extended_profiles migration)
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  relationship_status: string | null;
  emergency_contact: string | null;
  referral_source: string | null;
  referral_detail: string | null;
  medical_info: string | null;
  company_name: string | null;
  password_changed: boolean;
  billing_type: string;
  status: string;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Contact ──────────────────────────────────────────────

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  read: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Portfolio ────────────────────────────────────────────

export interface PortfolioItem {
  id: string;
  slug: string;
  title: LocalizedString;
  description: LocalizedString | null;
  hero_image_url: string | null;
  images: string[];
  alt_text: LocalizedString | null;
  industry: string | null;
  features: LocalizedString[];
  tech_stack: string[];
  live_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  deleted_at: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// ─── Activity Log ─────────────────────────────────────────

export interface ActivityLogEntry {
  id: string;
  actor_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  created_at: string;
}

// ─── Localization ─────────────────────────────────────────

export type LocalizedString = { en: string; af: string };
