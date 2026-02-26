-- ============================================================
-- seed.sql — Nortier Cupboards seed data
-- Run after all migrations.
-- ============================================================

-- ─── Site Settings ───────────────────────────────────────────
insert into public.site_content (section_key, content) values
  ('site_settings', '{
    "logo_text": "Nortier Cupboards",
    "company_name": "Nortier Cupboards",
    "company_tagline": {"en": "Custom Cupboards. Built to Last."},
    "login_label": {"en": "Login"},
    "login_url": "/login",
    "cta_label": {"en": "Get a Quote"},
    "cta_url": "/contact",
    "whatsapp_number": "",
    "phone_number": "",
    "email": "",
    "address": "Paarl, Western Cape",
    "google_maps_url": "",
    "google_maps_coordinates": null,
    "business_hours": "Mon-Fri 07:00-17:00",
    "social_links": []
  }'::jsonb)
on conflict (section_key) do nothing;

-- ─── Navigation Links ────────────────────────────────────────
insert into public.nav_links (label, href, display_order, is_active) values
  ('{"en": "Home"}'::jsonb, '/', 1, true),
  ('{"en": "About"}'::jsonb, '/about', 2, true),
  ('{"en": "Services"}'::jsonb, '/services', 3, true),
  ('{"en": "Gallery"}'::jsonb, '/gallery', 4, true),
  ('{"en": "Contact"}'::jsonb, '/contact', 5, true)
on conflict do nothing;

-- ─── Nav CTA ─────────────────────────────────────────────────
insert into public.site_content (section_key, content) values
  ('nav_cta', '{
    "label": {"en": "Get a Quote"},
    "href": "/contact"
  }'::jsonb)
on conflict (section_key) do nothing;

-- ─── Footer Sections ─────────────────────────────────────────
insert into public.footer_sections (title, links, display_order, is_active) values
  (
    '{"en": "Company"}'::jsonb,
    '[
      {"label": {"en": "About Us"}, "href": "/about"},
      {"label": {"en": "Services"}, "href": "/services"},
      {"label": {"en": "Gallery"}, "href": "/gallery"},
      {"label": {"en": "Contact"}, "href": "/contact"}
    ]'::jsonb,
    1, true
  ),
  (
    '{"en": "Legal"}'::jsonb,
    '[
      {"label": {"en": "Terms of Service"}, "href": "/terms"},
      {"label": {"en": "Privacy Policy"}, "href": "/privacy"}
    ]'::jsonb,
    2, true
  )
on conflict do nothing;

-- ─── Page SEO ────────────────────────────────────────────────
insert into public.page_seo (page_key, title, description) values
  ('home',      '{"en": "Nortier Cupboards | Custom Cupboards in Paarl"}'::jsonb,
                '{"en": "Custom cupboard design, manufacture and installation in Paarl, Western Cape. 20+ years experience."}'::jsonb),
  ('about',     '{"en": "About Us | Nortier Cupboards"}'::jsonb,
                '{"en": "Over 20 years of quality craftsmanship. Learn about our story and approach to custom cupboard design."}'::jsonb),
  ('services',  '{"en": "Services | Nortier Cupboards"}'::jsonb,
                '{"en": "Kitchen cupboards, built-in wardrobes, bathroom vanities, and more. Design to installation."}'::jsonb),
  ('gallery',   '{"en": "Gallery | Nortier Cupboards"}'::jsonb,
                '{"en": "See examples of our completed cupboard projects across the Cape Winelands."}'::jsonb),
  ('contact',   '{"en": "Contact Us | Nortier Cupboards"}'::jsonb,
                '{"en": "Get a free, no-obligation quote for your custom cupboards. Based in Paarl, serving the Western Cape."}'::jsonb),
  ('faq',       '{"en": "FAQ | Nortier Cupboards"}'::jsonb,
                '{"en": "Frequently asked questions about our cupboard design and installation services."}'::jsonb),
  ('terms',     '{"en": "Terms of Service | Nortier Cupboards"}'::jsonb,
                '{"en": "Terms and conditions for Nortier Cupboards services."}'::jsonb),
  ('privacy',   '{"en": "Privacy Policy | Nortier Cupboards"}'::jsonb,
                '{"en": "How Nortier Cupboards handles your personal data."}'::jsonb)
on conflict (page_key) do nothing;

-- ─── Homepage Sections ───────────────────────────────────────
insert into public.homepage_sections (section_key, content, display_order, is_active) values
  ('hero', '{
    "heading": {"en": "Custom Cupboards. Built to Last."},
    "subheading": {"en": "20+ years of quality craftsmanship in the Cape Winelands"},
    "cta_text": {"en": "Get a Free Quote"},
    "cta_secondary_text": {"en": "View Our Work"},
    "cta_url": "/contact",
    "cta_secondary_url": "/gallery",
    "background_image": null
  }'::jsonb, 1, true),

  ('services', '{
    "heading": {"en": "Our Services"},
    "subheading": {"en": "From design to installation"},
    "items": []
  }'::jsonb, 2, true),

  ('about', '{
    "heading": {"en": "About Nortier Cupboards"},
    "body": {"en": "With over 20 years of experience in the trade, Nortier Cupboards has built a reputation for quality, reliability, and professional service. Based in Paarl, we design, manufacture, and install custom cupboards for homes across the Cape Winelands and Western Cape."},
    "image": null
  }'::jsonb, 3, true),

  ('testimonials', '{
    "heading": {"en": "What Our Clients Say"},
    "items": []
  }'::jsonb, 4, true),

  ('cta', '{
    "heading": {"en": "Ready to transform your kitchen?"},
    "body": {"en": "Get a free, no-obligation quote. We'\''ll visit, measure, and design your dream cupboards."},
    "button_text": {"en": "Get a Free Quote"},
    "button_url": "/contact"
  }'::jsonb, 5, true)
on conflict (section_key) do nothing;

-- ─── Site Content (section_key pattern) ──────────────────────
insert into public.site_content (section_key, content) values
  ('hero_heading', '{"en": "Custom Cupboards. Built to Last."}'::jsonb),
  ('hero_subheading', '{"en": "20+ years of quality craftsmanship in the Cape Winelands"}'::jsonb),
  ('hero_cta_primary', '{"en": "Get a Free Quote"}'::jsonb),
  ('hero_cta_secondary', '{"en": "View Our Work"}'::jsonb),
  ('about_story', '{"en": "With over 20 years of experience in the trade, Nortier Cupboards has built a reputation for quality, reliability, and professional service. Based in Paarl, we design, manufacture, and install custom cupboards for homes across the Cape Winelands and Western Cape. No job is too big or too small — from a single bathroom vanity to a full house of built-in cupboards. We use ArtiCAD design software to give you a 3D preview of your cupboards before we build, so you know exactly what you'\''re getting."}'::jsonb),
  ('trust_strip', '{"en": "20+ Years Experience · Free Quotes · Design to Installation · Paarl & Surrounds"}'::jsonb),
  ('cta_heading', '{"en": "Ready to transform your kitchen?"}'::jsonb),
  ('cta_text', '{"en": "Get a free, no-obligation quote. We'\''ll visit, measure, and design your dream cupboards."}'::jsonb)
on conflict (section_key) do nothing;

-- ─── FAQs ────────────────────────────────────────────────────
insert into public.faqs (question, answer, display_order, is_active) values
  ('{"en": "What areas do you serve?"}'::jsonb,
   '{"en": "We are based in Paarl and serve the greater Cape Winelands and Western Cape region, including Stellenbosch, Franschhoek, Wellington, and surrounding areas."}'::jsonb,
   1, true),
  ('{"en": "How long does a kitchen installation take?"}'::jsonb,
   '{"en": "A typical kitchen installation takes 2-4 weeks from final design approval, depending on complexity. We will give you a clear timeline during the quoting process."}'::jsonb,
   2, true),
  ('{"en": "Do you provide 3D designs before building?"}'::jsonb,
   '{"en": "Yes! We use ArtiCAD design software to create a detailed 3D preview of your cupboards so you can see exactly what the finished product will look like before we start manufacturing."}'::jsonb,
   3, true),
  ('{"en": "How can I get a quote?"}'::jsonb,
   '{"en": "Simply fill out our contact form or give us a call. We will arrange a visit to measure your space and discuss your requirements, then provide a detailed, no-obligation quote."}'::jsonb,
   4, true)
on conflict do nothing;

-- ─── Admin User Note ─────────────────────────────────────────
-- To create an admin user:
-- 1. Sign up via the Supabase Auth dashboard or the app's register page
-- 2. Then update the role in user_profiles:
--    UPDATE public.user_profiles SET role = 'admin' WHERE email = 'your-admin@email.com';
-- 3. The custom_access_token_hook will pick up the role on next login.
