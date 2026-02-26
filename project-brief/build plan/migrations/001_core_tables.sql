-- ============================================
-- NORTIER CUPBOARDS — Migration 001
-- Core tables: settings, nav, content, services, projects, leads
-- ============================================

-- Site settings (single row — business details)
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL DEFAULT 'Nortier Cupboards',
  tagline TEXT DEFAULT 'Quality, experience and professional service',
  phone TEXT,
  email TEXT,
  whatsapp TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT DEFAULT 'Paarl',
  province TEXT DEFAULT 'Western Cape',
  postal_code TEXT,
  google_maps_embed TEXT,
  google_maps_url TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  business_hours JSONB DEFAULT '{
    "mon_fri": "07:30 – 17:00",
    "sat": "08:00 – 12:00 (by appointment)",
    "sun": "Closed"
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Navigation links
CREATE TABLE nav_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_cta BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Footer links
CREATE TABLE footer_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  column_name TEXT NOT NULL,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CMS content blocks
CREATE TABLE site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,
  section TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'text',
  value TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(page, section)
);

-- Services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  full_description TEXT,
  icon TEXT,
  image_url TEXT,
  features JSONB NOT NULL DEFAULT '[]',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Projects (gallery)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  room_type TEXT NOT NULL CHECK (room_type IN ('kitchen', 'bedroom', 'bathroom', 'study', 'other')),
  description TEXT,
  location TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Project images
CREATE TABLE project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_type TEXT NOT NULL DEFAULT 'after' CHECK (image_type IN ('before', 'after', 'progress')),
  alt_text TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Contact form submissions
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  service_interest TEXT,
  message TEXT,
  source TEXT NOT NULL DEFAULT 'website' CHECK (source IN ('website', 'whatsapp', 'manual')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'contacted', 'quoted', 'closed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  read_at TIMESTAMPTZ,
  CONSTRAINT contact_has_email_or_phone CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- Trust stats (homepage counters)
CREATE TABLE trust_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  suffix TEXT,
  icon TEXT,
  sort_order INT NOT NULL DEFAULT 0
);
