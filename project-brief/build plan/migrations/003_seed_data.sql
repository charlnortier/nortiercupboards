-- ============================================
-- NORTIER CUPBOARDS — Migration 003
-- Seed data
-- ============================================

-- Site settings
INSERT INTO site_settings (business_name, tagline, city, province) VALUES
  ('Nortier Cupboards', 'Quality, experience and professional service', 'Paarl', 'Western Cape');

-- Nav links
INSERT INTO nav_links (label, href, sort_order, is_cta) VALUES
  ('Home', '/', 0, false),
  ('About', '/about', 1, false),
  ('Services', '/services', 2, false),
  ('Gallery', '/gallery', 3, false),
  ('Contact', '/contact', 4, false),
  ('Get a Quote', '/contact', 5, true);

-- Footer links
INSERT INTO footer_links (column_name, label, href, sort_order) VALUES
  ('services', 'Kitchen Cupboards', '/services', 0),
  ('services', 'Bedroom Cupboards', '/services', 1),
  ('services', 'Bathroom Vanities', '/services', 2),
  ('services', 'Shutters & Blinds', '/services', 3),
  ('company', 'About Us', '/about', 0),
  ('company', 'Our Work', '/gallery', 1),
  ('company', 'Contact', '/contact', 2);

-- Services
INSERT INTO services (title, slug, short_description, icon, sort_order, features) VALUES
  ('Kitchen Cupboards', 'kitchen-cupboards',
   'Custom kitchens designed, built, and installed — from melamine to hand-painted finishes.',
   '🍳', 0,
   '["Melamine, wrap, spray & hand-painted finishes", "Soft-close hinges & drawer systems", "Countertop coordination", "ArtiCAD 3D design included"]'::jsonb),

  ('Bedroom Cupboards', 'bedroom-cupboards',
   'Built-in wardrobes and walk-in closets tailored to your space.',
   '🛏️', 1,
   '["Sliding & hinged door options", "Custom interiors — shelves, drawers, rails", "Walk-in closet design", "Full range of finishes"]'::jsonb),

  ('Bathroom Vanities', 'bathroom-vanities',
   'Wall-hung and freestanding vanities in moisture-resistant materials.',
   '🚿', 2,
   '["Wall-hung & freestanding options", "Moisture-resistant materials", "Mirror cabinets", "Custom sizing"]'::jsonb),

  ('Study & Office', 'study-office',
   'Built-in desks, bookshelves, and storage for productive workspaces.',
   '📚', 3,
   '["Built-in desks & bookshelves", "Cable management solutions", "Custom storage", "Home office design"]'::jsonb),

  ('Loose Furniture', 'loose-furniture',
   'Freestanding units you take with you when you move.',
   '🪑', 4,
   '["TV units & sideboards", "Display cabinets", "Custom freestanding pieces", "Portable — take it when you move"]'::jsonb),

  ('Security Shutters & Blinds', 'shutters-blinds',
   'Aluminium, basswood, plaswood, and bamboo — measured, supplied, and installed.',
   '🪟', 5,
   '["Aluminium venetian blinds", "Basswood & plaswood options", "Bamboo blinds", "Security shutters", "Motorised options", "Measure + supply + install"]'::jsonb);

-- Trust stats
INSERT INTO trust_stats (label, value, suffix, icon, sort_order) VALUES
  ('Experience', '20+', 'Years', '🏗️', 0),
  ('Kitchens Built', '500+', 'Projects', '🍳', 1),
  ('Based In', 'Paarl', 'Western Cape', '📍', 2),
  ('Quotes', 'Free', 'Always', '✓', 3);

-- Homepage content
INSERT INTO site_content (page, section, value) VALUES
  ('home', 'hero_title', 'Custom Cupboards. Built to Last.'),
  ('home', 'hero_subtitle', '20+ years of quality craftsmanship in the Cape Winelands'),
  ('home', 'hero_cta_primary', 'Get a Free Quote'),
  ('home', 'hero_cta_secondary', 'View Our Work'),
  ('home', 'intro_text', 'Nortier Cupboards has been designing, manufacturing, and installing custom cupboards for over 20 years. Based in Paarl, we serve the Cape Winelands and broader Western Cape with kitchens, bedrooms, bathrooms, and studies — from affordable melamine to hand-painted high-gloss finishes.'),
  ('home', 'trust_strip', '20+ Years Experience · Free Quotes · Design to Installation · Paarl & Surrounds'),
  ('home', 'cta_heading', 'Ready to transform your kitchen?'),
  ('home', 'cta_text', 'Get a free, no-obligation quote. We''ll visit, measure, and design your dream cupboards.');

-- About page content
INSERT INTO site_content (page, section, value) VALUES
  ('about', 'story', 'With over 20 years of experience in the trade, Nortier Cupboards has built a reputation for quality, reliability, and professional service. Based in Paarl, we design, manufacture, and install custom cupboards for homes across the Cape Winelands and Western Cape. No job is too big or too small — from a single bathroom vanity to a full house of built-in cupboards. We use ArtiCAD design software to give you a 3D preview of your cupboards before we build, so you know exactly what you''re getting.'),
  ('about', 'process_step1', 'Consultation — we visit your home, measure, and discuss your vision.'),
  ('about', 'process_step2', 'Design — 3D ArtiCAD renders so you see it before we build.'),
  ('about', 'process_step3', 'Manufacture — built locally in our Paarl workshop.'),
  ('about', 'process_step4', 'Installation — professional fitting with minimal disruption.');

-- Contact page content
INSERT INTO site_content (page, section, value) VALUES
  ('contact', 'form_success', 'Thanks for getting in touch! We''ll get back to you within 24 hours.');

-- Placeholder projects (to test gallery)
INSERT INTO projects (title, slug, room_type, location, is_featured, sort_order) VALUES
  ('Modern Kitchen Renovation', 'modern-kitchen-renovation', 'kitchen', 'Stellenbosch', true, 0),
  ('Classic White Kitchen', 'classic-white-kitchen', 'kitchen', 'Paarl', true, 1),
  ('Master Bedroom Built-ins', 'master-bedroom-builtins', 'bedroom', 'Franschhoek', true, 2),
  ('Bathroom Vanity Unit', 'bathroom-vanity-unit', 'bathroom', 'Wellington', true, 3),
  ('Home Office Study', 'home-office-study', 'study', 'Paarl', false, 4),
  ('Oak Kitchen — De Doorns', 'oak-kitchen-de-doorns', 'kitchen', 'De Doorns', false, 5);
