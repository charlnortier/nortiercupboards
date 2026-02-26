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
on conflict (section_key) do update set content = excluded.content;

-- ─── Navigation Links ────────────────────────────────────────
delete from public.nav_links;
insert into public.nav_links (label, href, display_order, is_active) values
  ('{"en": "Home"}'::jsonb, '/', 1, true),
  ('{"en": "About"}'::jsonb, '/about', 2, true),
  ('{"en": "Services"}'::jsonb, '/services', 3, true),
  ('{"en": "Gallery"}'::jsonb, '/portfolio', 4, true),
  ('{"en": "Contact"}'::jsonb, '/contact', 5, true)
on conflict do nothing;

-- ─── Nav CTA ─────────────────────────────────────────────────
insert into public.site_content (section_key, content) values
  ('nav_cta', '{
    "label": {"en": "Get a Quote"},
    "href": "/contact"
  }'::jsonb)
on conflict (section_key) do update set content = excluded.content;

-- ─── Footer Sections ─────────────────────────────────────────
delete from public.footer_sections;
insert into public.footer_sections (title, links, display_order, is_active) values
  (
    '{"en": "Services"}'::jsonb,
    '[
      {"label": {"en": "Kitchen Cupboards"}, "href": "/services"},
      {"label": {"en": "Bedroom Cupboards"}, "href": "/services"},
      {"label": {"en": "Bathroom Vanities"}, "href": "/services"},
      {"label": {"en": "Shutters & Blinds"}, "href": "/services"}
    ]'::jsonb,
    0, true
  ),
  (
    '{"en": "Company"}'::jsonb,
    '[
      {"label": {"en": "About Us"}, "href": "/about"},
      {"label": {"en": "Services"}, "href": "/services"},
      {"label": {"en": "Gallery"}, "href": "/portfolio"},
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
    "cta_url": "/contact",
    "cta_secondary_text": {"en": "View Our Work"},
    "cta_secondary_url": "/portfolio",
    "background_image": null
  }'::jsonb, 1, true),

  ('trust_stats', '{
    "items": [
      {"icon": "🏗️", "value": "20+", "label": "Years Experience"},
      {"icon": "🏠", "value": "500+", "label": "Projects Completed"},
      {"icon": "📍", "value": "Paarl", "label": "Western Cape"},
      {"icon": "✓", "value": "Free", "label": "Quotes & Site Visits"}
    ]
  }'::jsonb, 2, true),

  ('services', '{
    "heading": {"en": "What We Build"},
    "subheading": {"en": "From kitchen cupboards to security shutters — we design, manufacture, and install."},
    "items": [
      {"icon": "🍳", "title": {"en": "Kitchen Cupboards"}, "description": {"en": "Custom kitchen designs in melamine, wrap, spray-painted, or hand-painted finishes. Includes soft-close hardware and countertop coordination."}},
      {"icon": "🛏️", "title": {"en": "Bedroom Cupboards"}, "description": {"en": "Built-in wardrobes and walk-in closets with sliding or hinged doors. Custom interiors with shelves, drawers, and hanging rails."}},
      {"icon": "🚿", "title": {"en": "Bathroom Vanities"}, "description": {"en": "Wall-hung and freestanding vanities in moisture-resistant materials. Mirror cabinets and storage solutions."}},
      {"icon": "📚", "title": {"en": "Study & Office"}, "description": {"en": "Custom desks, bookshelves, and built-in storage with integrated cable management for your home office."}},
      {"icon": "🪑", "title": {"en": "Loose Furniture"}, "description": {"en": "Freestanding units you take when you move — TV units, sideboards, display cabinets, and entertainment centres."}},
      {"icon": "🪟", "title": {"en": "Shutters & Blinds"}, "description": {"en": "Security shutters and window blinds in aluminium, basswood, plaswood, and bamboo. Motorised options available."}}
    ]
  }'::jsonb, 3, true),

  ('about', '{
    "heading": {"en": "About Nortier Cupboards"},
    "body": {"en": "With over 20 years of experience, Nortier Cupboards has built a reputation for quality, reliability, and professional service across the Cape Winelands."}
  }'::jsonb, 4, true),

  ('cta', '{
    "heading": {"en": "Ready to transform your space?"},
    "body": {"en": "Get a free, no-obligation quote. We''ll visit, measure, and design your dream cupboards."},
    "button_text": {"en": "Get a Free Quote"},
    "button_url": "/contact"
  }'::jsonb, 5, true)
on conflict (section_key) do update set content = excluded.content, display_order = excluded.display_order;

-- ─── Site Content: About ─────────────────────────────────────
insert into public.site_content (section_key, content) values
  ('about', '{
    "heading": {"en": "About Nortier Cupboards"},
    "body": {"en": "With over 20 years of experience in the trade, Nortier Cupboards has built a reputation for quality, reliability, and professional service. Based in Paarl, we design, manufacture, and install custom cupboards for homes across the Cape Winelands and Western Cape.\n\nNo job is too big or too small — from a single bathroom vanity to a full house of built-in cupboards. We use ArtiCAD design software to give you a 3D preview of your cupboards before we build, so you know exactly what you''re getting.\n\nOur workshop in Paarl is equipped with modern machinery, and our team combines traditional craftsmanship with the latest manufacturing techniques. Every project is treated with the same attention to detail, whether it''s a R30,000 bathroom vanity or a R300,000 kitchen."},
    "mission": {"en": "To deliver custom cupboard solutions that combine quality craftsmanship, innovative design, and professional service — making every home more beautiful and functional."},
    "process": [
      {"step": "01", "title": {"en": "Consultation"}, "description": {"en": "We visit your home, take measurements, and discuss your vision, style preferences, and budget."}},
      {"step": "02", "title": {"en": "Design"}, "description": {"en": "Using ArtiCAD software, we create detailed 3D renders so you can see exactly what your cupboards will look like before we build."}},
      {"step": "03", "title": {"en": "Manufacture"}, "description": {"en": "Built in our Paarl workshop using quality materials. Every component is precision-cut and assembled with care."}},
      {"step": "04", "title": {"en": "Installation"}, "description": {"en": "Professional fitting by our experienced team, with minimal disruption to your home. We clean up after ourselves."}}
    ],
    "values": [
      {"title": {"en": "20+ Years Experience"}, "description": {"en": "Two decades of building custom cupboards across the Cape Winelands."}},
      {"title": {"en": "3D Design Preview"}, "description": {"en": "ArtiCAD software lets you see your cupboards in 3D before we start manufacturing."}},
      {"title": {"en": "Full Service"}, "description": {"en": "We handle everything — design, manufacture, and professional installation."}},
      {"title": {"en": "Quality Materials"}, "description": {"en": "From affordable melamine to premium spray-painted finishes, we work with your budget."}},
      {"title": {"en": "Local & Reliable"}, "description": {"en": "Based in Paarl, serving Stellenbosch, Franschhoek, Wellington, and the broader Western Cape."}},
      {"title": {"en": "References Available"}, "description": {"en": "Happy to connect you with past clients who can vouch for our work."}}
    ],
    "service_area": {"en": "We serve Paarl, Stellenbosch, Franschhoek, Wellington, Somerset West, and the broader Western Cape region."}
  }'::jsonb)
on conflict (section_key) do update set content = excluded.content;

-- ─── Site Content: Services Detail ───────────────────────────
insert into public.site_content (section_key, content) values
  ('services_detail', '{
    "heading": {"en": "Our Services"},
    "intro": {"en": "From design to installation, we handle every step. Each service includes a free consultation and 3D design preview."},
    "items": [
      {
        "icon": "🍳",
        "title": {"en": "Kitchen Cupboards"},
        "description": {"en": "The kitchen is the heart of your home, and our custom kitchen cupboards are designed to make it beautiful and functional. We offer everything from affordable melamine to premium spray-painted and hand-painted finishes.\n\nEvery kitchen starts with a 3D ArtiCAD design so you can visualise the final result before we begin manufacturing. We coordinate with countertop suppliers and handle the complete installation."},
        "features": ["Melamine, wrap & spray finishes", "Soft-close hinges & drawers", "Countertop coordination", "3D ArtiCAD design included", "Under-cabinet lighting options"]
      },
      {
        "icon": "🛏️",
        "title": {"en": "Bedroom Cupboards"},
        "description": {"en": "Maximise your bedroom storage with custom built-in wardrobes designed to fit your space perfectly. Choose from sliding doors, hinged doors, or open shelving systems.\n\nWe design the interior to suit your lifestyle — hanging rails, shelving, drawers, shoe racks, and accessories. Walk-in closet designs available for larger spaces."},
        "features": ["Sliding & hinged doors", "Custom interior layouts", "Walk-in closet designs", "Mirrored door options", "Lighting integration"]
      },
      {
        "icon": "🚿",
        "title": {"en": "Bathroom Vanities"},
        "description": {"en": "Custom bathroom vanities and cabinets built with moisture-resistant materials to withstand the bathroom environment. Wall-hung and freestanding options available.\n\nWe also build mirror cabinets, linen cupboards, and other bathroom storage solutions to keep your space organised."},
        "features": ["Moisture-resistant materials", "Wall-hung & freestanding", "Mirror cabinets", "Storage solutions", "Custom sizing"]
      },
      {
        "icon": "📚",
        "title": {"en": "Study & Office"},
        "description": {"en": "Create the perfect home office with custom desks, bookshelves, and built-in storage. We integrate cable management solutions to keep your workspace tidy.\n\nWhether you need a compact study nook or a full home office, we design it to maximise productivity and style."},
        "features": ["Custom desks & shelving", "Cable management", "Compact to full office", "Built-in storage", "Adjustable shelving"]
      },
      {
        "icon": "🪑",
        "title": {"en": "Loose Furniture"},
        "description": {"en": "Freestanding furniture pieces that you can take with you when you move. TV units, sideboards, display cabinets, and entertainment centres — all built to your specifications."},
        "features": ["TV units & entertainment", "Sideboards & display", "Custom dimensions", "Matching finishes", "Quality hardware"]
      },
      {
        "icon": "🪟",
        "title": {"en": "Security Shutters & Blinds"},
        "description": {"en": "Complete your home with security shutters and window blinds. We offer aluminium, basswood, plaswood, and bamboo options, including motorised blinds for convenience.\n\nWe measure, supply, and install — ensuring a perfect fit every time."},
        "features": ["Aluminium & wood options", "Motorised available", "Measure, supply & install", "Security shutters", "Custom colours"]
      }
    ]
  }'::jsonb)
on conflict (section_key) do update set content = excluded.content;

-- ─── Site Content (legacy key-value entries) ─────────────────
insert into public.site_content (section_key, content) values
  ('hero_heading', '{"en": "Custom Cupboards. Built to Last."}'::jsonb),
  ('hero_subheading', '{"en": "20+ years of quality craftsmanship in the Cape Winelands"}'::jsonb),
  ('hero_cta_primary', '{"en": "Get a Free Quote"}'::jsonb),
  ('hero_cta_secondary', '{"en": "View Our Work"}'::jsonb),
  ('about_story', '{"en": "With over 20 years of experience in the trade, Nortier Cupboards has built a reputation for quality, reliability, and professional service. Based in Paarl, we design, manufacture, and install custom cupboards for homes across the Cape Winelands and Western Cape. No job is too big or too small — from a single bathroom vanity to a full house of built-in cupboards. We use ArtiCAD design software to give you a 3D preview of your cupboards before we build, so you know exactly what you''re getting."}'::jsonb),
  ('trust_strip', '{"en": "20+ Years Experience · Free Quotes · Design to Installation · Paarl & Surrounds"}'::jsonb),
  ('cta_heading', '{"en": "Ready to transform your space?"}'::jsonb),
  ('cta_text', '{"en": "Get a free, no-obligation quote. We''ll visit, measure, and design your dream cupboards."}'::jsonb)
on conflict (section_key) do update set content = excluded.content;

-- ─── FAQs ────────────────────────────────────────────────────
delete from public.faqs;
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
   4, true),
  ('{"en": "What finishes are available?"}'::jsonb,
   '{"en": "We offer a wide range of finishes including melamine (most affordable), vinyl wrap, spray-painted, and hand-painted. During your consultation, we''ll show you samples and help you choose the best option for your budget and style."}'::jsonb,
   5, true),
  ('{"en": "Do you offer a warranty?"}'::jsonb,
   '{"en": "Yes, all our cupboard installations come with a workmanship warranty. We stand behind the quality of our work and will address any issues promptly."}'::jsonb,
   6, true)
on conflict do nothing;

-- ─── Admin User Note ─────────────────────────────────────────
-- To create an admin user:
-- 1. Sign up via the Supabase Auth dashboard or the app's register page
-- 2. Then update the role in user_profiles:
--    UPDATE public.user_profiles SET role = 'admin' WHERE email = 'your-admin@email.com';
-- 3. The custom_access_token_hook will pick up the role on next login.
