-- ============================================================
-- seed.sql — Nortier Cupboards seed data
-- Run after all migrations.
-- ============================================================

-- ─── Site Settings ───────────────────────────────────────────
insert into public.site_content (section_key, content) values
  ('site_settings', '{
    "logo_text": "Nortier Cupboards",
    "company_name": "Nortier Cupboards",
    "company_tagline": {"en": "Custom Cupboards. Built to Last.", "af": "Pasgemaakte Kaste. Gebou om te Hou."},
    "login_label": {"en": "Login", "af": "Teken In"},
    "login_url": "/login",
    "cta_label": {"en": "Get a Quote", "af": "Kry ''n Kwotasie"},
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
  ('{"en": "Home", "af": "Tuis"}'::jsonb, '/', 1, true),
  ('{"en": "About", "af": "Oor Ons"}'::jsonb, '/about', 2, true),
  ('{"en": "Services", "af": "Dienste"}'::jsonb, '/services', 3, true),
  ('{"en": "Gallery", "af": "Galery"}'::jsonb, '/portfolio', 4, true),
  ('{"en": "Contact", "af": "Kontak"}'::jsonb, '/contact', 5, true)
on conflict do nothing;

-- ─── Nav CTA ─────────────────────────────────────────────────
insert into public.site_content (section_key, content) values
  ('nav_cta', '{
    "label": {"en": "Get a Quote", "af": "Kry ''n Kwotasie"},
    "href": "/contact"
  }'::jsonb)
on conflict (section_key) do update set content = excluded.content;

-- ─── Footer Sections ─────────────────────────────────────────
delete from public.footer_sections;
insert into public.footer_sections (title, links, display_order, is_active) values
  (
    '{"en": "Services", "af": "Dienste"}'::jsonb,
    '[
      {"label": {"en": "Kitchen Cupboards", "af": "Kombuiskaste"}, "href": "/services"},
      {"label": {"en": "Bedroom Cupboards", "af": "Slaapkamerkaste"}, "href": "/services"},
      {"label": {"en": "Bathroom Vanities", "af": "Badkamermeubels"}, "href": "/services"},
      {"label": {"en": "Shutters & Blinds", "af": "Luike & Blindings"}, "href": "/services"}
    ]'::jsonb,
    0, true
  ),
  (
    '{"en": "Company", "af": "Maatskappy"}'::jsonb,
    '[
      {"label": {"en": "About Us", "af": "Oor Ons"}, "href": "/about"},
      {"label": {"en": "Services", "af": "Dienste"}, "href": "/services"},
      {"label": {"en": "Gallery", "af": "Galery"}, "href": "/portfolio"},
      {"label": {"en": "Contact", "af": "Kontak"}, "href": "/contact"}
    ]'::jsonb,
    1, true
  ),
  (
    '{"en": "Legal", "af": "Regskennis"}'::jsonb,
    '[
      {"label": {"en": "Terms of Service", "af": "Diensvoorwaardes"}, "href": "/terms"},
      {"label": {"en": "Privacy Policy", "af": "Privaatheidsbeleid"}, "href": "/privacy"}
    ]'::jsonb,
    2, true
  )
on conflict do nothing;

-- ─── Page SEO ────────────────────────────────────────────────
insert into public.page_seo (page_key, title, description) values
  ('home',      '{"en": "Nortier Cupboards | Custom Cupboards in Paarl", "af": "Nortier Cupboards | Pasgemaakte Kaste in Paarl"}'::jsonb,
                '{"en": "Custom cupboard design, manufacture and installation in Paarl, Western Cape. 20+ years experience.", "af": "Pasgemaakte kasontwerp, vervaardiging en installering in Paarl, Wes-Kaap. 20+ jaar ervaring."}'::jsonb),
  ('about',     '{"en": "About Us | Nortier Cupboards", "af": "Oor Ons | Nortier Cupboards"}'::jsonb,
                '{"en": "Over 20 years of quality craftsmanship. Learn about our story and approach to custom cupboard design.", "af": "Meer as 20 jaar se gehalte vakmanskap. Leer oor ons storie en benadering tot pasgemaakte kasontwerp."}'::jsonb),
  ('services',  '{"en": "Services | Nortier Cupboards", "af": "Dienste | Nortier Cupboards"}'::jsonb,
                '{"en": "Kitchen cupboards, built-in wardrobes, bathroom vanities, and more. Design to installation.", "af": "Kombuiskaste, ingeboude garderobkaste, badkamermeubels en meer. Van ontwerp tot installering."}'::jsonb),
  ('gallery',   '{"en": "Gallery | Nortier Cupboards", "af": "Galery | Nortier Cupboards"}'::jsonb,
                '{"en": "See examples of our completed cupboard projects across the Cape Winelands.", "af": "Sien voorbeelde van ons voltooide kasprojekte regoor die Kaapse Wynland."}'::jsonb),
  ('contact',   '{"en": "Contact Us | Nortier Cupboards", "af": "Kontak Ons | Nortier Cupboards"}'::jsonb,
                '{"en": "Get a free, no-obligation quote for your custom cupboards. Based in Paarl, serving the Western Cape.", "af": "Kry ''n gratis, vryblywende kwotasie vir jou pasgemaakte kaste. Gebaseer in Paarl, ons bedien die Wes-Kaap."}'::jsonb),
  ('faq',       '{"en": "FAQ | Nortier Cupboards", "af": "Gereelde Vrae | Nortier Cupboards"}'::jsonb,
                '{"en": "Frequently asked questions about our cupboard design and installation services.", "af": "Gereelde vrae oor ons kasontwerp- en installeringsdienste."}'::jsonb),
  ('terms',     '{"en": "Terms of Service | Nortier Cupboards", "af": "Diensvoorwaardes | Nortier Cupboards"}'::jsonb,
                '{"en": "Terms and conditions for Nortier Cupboards services.", "af": "Terme en voorwaardes vir Nortier Cupboards se dienste."}'::jsonb),
  ('privacy',   '{"en": "Privacy Policy | Nortier Cupboards", "af": "Privaatheidsbeleid | Nortier Cupboards"}'::jsonb,
                '{"en": "How Nortier Cupboards handles your personal data.", "af": "Hoe Nortier Cupboards jou persoonlike data hanteer."}'::jsonb)
on conflict (page_key) do nothing;

-- ─── Homepage Sections ───────────────────────────────────────
insert into public.homepage_sections (section_key, content, display_order, is_active) values
  ('hero', '{
    "heading": {"en": "Custom Cupboards. Built to Last.", "af": "Pasgemaakte Kaste. Gebou om te Hou."},
    "subheading": {"en": "20+ years of quality craftsmanship in the Cape Winelands", "af": "20+ jaar se gehalte vakmanskap in die Kaapse Wynland"},
    "cta_text": {"en": "Get a Free Quote", "af": "Kry ''n Gratis Kwotasie"},
    "cta_url": "/contact",
    "cta_secondary_text": {"en": "View Our Work", "af": "Sien Ons Werk"},
    "cta_secondary_url": "/portfolio",
    "background_image": null
  }'::jsonb, 1, true),

  ('trust_stats', '{
    "items": [
      {"icon": "🏗️", "value": "20+", "label": {"en": "Years Experience", "af": "Jaar Ervaring"}},
      {"icon": "🏠", "value": "500+", "label": {"en": "Projects Completed", "af": "Projekte Voltooi"}},
      {"icon": "📍", "value": "Paarl", "label": {"en": "Western Cape", "af": "Wes-Kaap"}},
      {"icon": "✓", "value": "Free", "label": {"en": "Quotes & Site Visits", "af": "Kwotasies & Terreinbesoeke"}}
    ]
  }'::jsonb, 2, true),

  ('services', '{
    "heading": {"en": "What We Build", "af": "Wat Ons Bou"},
    "subheading": {"en": "From kitchen cupboards to security shutters — we design, manufacture, and install.", "af": "Van kombuiskaste tot sekuriteitluike — ons ontwerp, vervaardig en installeer."},
    "items": [
      {"icon": "🍳", "title": {"en": "Kitchen Cupboards", "af": "Kombuiskaste"}, "description": {"en": "Custom kitchen designs in melamine, wrap, spray-painted, or hand-painted finishes. Includes soft-close hardware and countertop coordination.", "af": "Pasgemaakte kombuisontwerpe in melamien, omhulsel, spuitverf of handgeverfde afwerkings. Sluit sagtesluit-hardeware en boonblad-koördinasie in."}},
      {"icon": "🛏️", "title": {"en": "Bedroom Cupboards", "af": "Slaapkamerkaste"}, "description": {"en": "Built-in wardrobes and walk-in closets with sliding or hinged doors. Custom interiors with shelves, drawers, and hanging rails.", "af": "Ingeboude garderobkaste en instapkaste met skuif- of skarniere deure. Pasgemaakte binneruimtes met rakke, laaie en hangstawe."}},
      {"icon": "🚿", "title": {"en": "Bathroom Vanities", "af": "Badkamermeubels"}, "description": {"en": "Wall-hung and freestanding vanities in moisture-resistant materials. Mirror cabinets and storage solutions.", "af": "Muur-gehangde en vrystaande meubels in vogbestande materiale. Spieëlkaste en bergingsoplossings."}},
      {"icon": "📚", "title": {"en": "Study & Office", "af": "Studeerkamer & Kantoor"}, "description": {"en": "Custom desks, bookshelves, and built-in storage with integrated cable management for your home office.", "af": "Pasgemaakte lessenaars, boekrakke en ingeboude berging met geïntegreerde kabelbeheer vir jou tuiskantoor."}},
      {"icon": "🪑", "title": {"en": "Loose Furniture", "af": "Los Meubels"}, "description": {"en": "Freestanding units you take when you move — TV units, sideboards, display cabinets, and entertainment centres.", "af": "Vrystaande eenhede wat jy saamvat wanneer jy trek — TV-eenhede, dressoirs, vertoonkaste en vermaaksentrums."}},
      {"icon": "🪟", "title": {"en": "Shutters & Blinds", "af": "Luike & Blindings"}, "description": {"en": "Security shutters and window blinds in aluminium, basswood, plaswood, and bamboo. Motorised options available.", "af": "Sekuriteitluike en vensterblindings in aluminium, basswood, plaswood en bamboes. Gemotoriseerde opsies beskikbaar."}}
    ]
  }'::jsonb, 3, true),

  ('about', '{
    "heading": {"en": "About Nortier Cupboards", "af": "Oor Nortier Cupboards"},
    "body": {"en": "With over 20 years of experience, Nortier Cupboards has built a reputation for quality, reliability, and professional service across the Cape Winelands.", "af": "Met meer as 20 jaar se ervaring het Nortier Cupboards ''n reputasie gebou vir gehalte, betroubaarheid en professionele diens regoor die Kaapse Wynland."}
  }'::jsonb, 4, true),

  ('cta', '{
    "heading": {"en": "Ready to transform your space?", "af": "Gereed om jou ruimte te transformeer?"},
    "body": {"en": "Get a free, no-obligation quote. We''ll visit, measure, and design your dream cupboards.", "af": "Kry ''n gratis, vryblywende kwotasie. Ons sal besoek, meet en jou droomkaste ontwerp."},
    "button_text": {"en": "Get a Free Quote", "af": "Kry ''n Gratis Kwotasie"},
    "button_url": "/contact"
  }'::jsonb, 5, true)
on conflict (section_key) do update set content = excluded.content, display_order = excluded.display_order;

-- ─── Site Content: About ─────────────────────────────────────
insert into public.site_content (section_key, content) values
  ('about', '{
    "heading": {"en": "About Nortier Cupboards", "af": "Oor Nortier Cupboards"},
    "body": {"en": "With over 20 years of experience in the trade, Nortier Cupboards has built a reputation for quality, reliability, and professional service. Based in Paarl, we design, manufacture, and install custom cupboards for homes across the Cape Winelands and Western Cape.\n\nNo job is too big or too small — from a single bathroom vanity to a full house of built-in cupboards. We use ArtiCAD design software to give you a 3D preview of your cupboards before we build, so you know exactly what you''re getting.\n\nOur workshop in Paarl is equipped with modern machinery, and our team combines traditional craftsmanship with the latest manufacturing techniques. Every project is treated with the same attention to detail, whether it''s a R30,000 bathroom vanity or a R300,000 kitchen.", "af": "Met meer as 20 jaar se ervaring in die bedryf het Nortier Cupboards ''n reputasie gebou vir gehalte, betroubaarheid en professionele diens. Gebaseer in Paarl, ontwerp, vervaardig en installeer ons pasgemaakte kaste vir huise regoor die Kaapse Wynland en Wes-Kaap.\n\nGeen werk is te groot of te klein nie — van ''n enkele badkamermeubel tot ''n volle huis se ingeboude kaste. Ons gebruik ArtiCAD-ontwerpsagteware om jou ''n 3D-voorskou van jou kaste te gee voordat ons bou, sodat jy presies weet wat jy kry.\n\nOns werkswinkel in Paarl is toegerus met moderne masjinerie, en ons span kombineer tradisionele vakmanskap met die nuutste vervaardigingstegnieke. Elke projek word met dieselfde aandag aan detail behandel, of dit nou ''n R30 000-badkamermeubel of ''n R300 000-kombuis is."},
    "mission": {"en": "To deliver custom cupboard solutions that combine quality craftsmanship, innovative design, and professional service — making every home more beautiful and functional.", "af": "Om pasgemaakte kasoplossings te lewer wat gehalte vakmanskap, innoverende ontwerp en professionele diens kombineer — om elke huis mooier en meer funksioneel te maak."},
    "process": [
      {"step": "01", "title": {"en": "Consultation", "af": "Konsultasie"}, "description": {"en": "We visit your home, take measurements, and discuss your vision, style preferences, and budget.", "af": "Ons besoek jou huis, neem afmetings, en bespreek jou visie, stylvoorkeure en begroting."}},
      {"step": "02", "title": {"en": "Design", "af": "Ontwerp"}, "description": {"en": "Using ArtiCAD software, we create detailed 3D renders so you can see exactly what your cupboards will look like before we build.", "af": "Met ArtiCAD-sagteware skep ons gedetailleerde 3D-weergawes sodat jy presies kan sien hoe jou kaste sal lyk voordat ons bou."}},
      {"step": "03", "title": {"en": "Manufacture", "af": "Vervaardiging"}, "description": {"en": "Built in our Paarl workshop using quality materials. Every component is precision-cut and assembled with care.", "af": "Gebou in ons Paarl-werkswinkel met gehaltemateriaal. Elke komponent word presisie-gesny en met sorg saamgestel."}},
      {"step": "04", "title": {"en": "Installation", "af": "Installering"}, "description": {"en": "Professional fitting by our experienced team, with minimal disruption to your home. We clean up after ourselves.", "af": "Professionele passing deur ons ervare span, met minimale ontwrigting van jou huis. Ons ruim agterna op."}}
    ],
    "values": [
      {"title": {"en": "20+ Years Experience", "af": "20+ Jaar Ervaring"}, "description": {"en": "Two decades of building custom cupboards across the Cape Winelands.", "af": "Twee dekades se bou van pasgemaakte kaste regoor die Kaapse Wynland."}},
      {"title": {"en": "3D Design Preview", "af": "3D-Ontwerpvoorskou"}, "description": {"en": "ArtiCAD software lets you see your cupboards in 3D before we start manufacturing.", "af": "ArtiCAD-sagteware laat jou jou kaste in 3D sien voordat ons begin vervaardig."}},
      {"title": {"en": "Full Service", "af": "Volle Diens"}, "description": {"en": "We handle everything — design, manufacture, and professional installation.", "af": "Ons hanteer alles — ontwerp, vervaardiging en professionele installering."}},
      {"title": {"en": "Quality Materials", "af": "Gehaltemateriaal"}, "description": {"en": "From affordable melamine to premium spray-painted finishes, we work with your budget.", "af": "Van bekostigbare melamien tot premium spuitverf-afwerkings, ons werk met jou begroting."}},
      {"title": {"en": "Local & Reliable", "af": "Plaaslik & Betroubaar"}, "description": {"en": "Based in Paarl, serving Stellenbosch, Franschhoek, Wellington, and the broader Western Cape.", "af": "Gebaseer in Paarl, ons bedien Stellenbosch, Franschhoek, Wellington en die breër Wes-Kaap."}},
      {"title": {"en": "References Available", "af": "Verwysings Beskikbaar"}, "description": {"en": "Happy to connect you with past clients who can vouch for our work.", "af": "Ons stel jou graag in verbinding met vorige kliënte wat vir ons werk kan instaan."}}
    ],
    "service_area": {"en": "We serve Paarl, Stellenbosch, Franschhoek, Wellington, Somerset West, and the broader Western Cape region.", "af": "Ons bedien Paarl, Stellenbosch, Franschhoek, Wellington, Somerset-Wes en die breër Wes-Kaap-streek."}
  }'::jsonb)
on conflict (section_key) do update set content = excluded.content;

-- ─── Site Content: Services Detail ───────────────────────────
insert into public.site_content (section_key, content) values
  ('services_detail', '{
    "heading": {"en": "Our Services", "af": "Ons Dienste"},
    "intro": {"en": "From design to installation, we handle every step. Each service includes a free consultation and 3D design preview.", "af": "Van ontwerp tot installering, ons hanteer elke stap. Elke diens sluit ''n gratis konsultasie en 3D-ontwerpvoorskou in."},
    "items": [
      {
        "icon": "🍳",
        "title": {"en": "Kitchen Cupboards", "af": "Kombuiskaste"},
        "description": {"en": "The kitchen is the heart of your home, and our custom kitchen cupboards are designed to make it beautiful and functional. We offer everything from affordable melamine to premium spray-painted and hand-painted finishes.\n\nEvery kitchen starts with a 3D ArtiCAD design so you can visualise the final result before we begin manufacturing. We coordinate with countertop suppliers and handle the complete installation.", "af": "Die kombuis is die hart van jou huis, en ons pasgemaakte kombuiskaste is ontwerp om dit mooi en funksioneel te maak. Ons bied alles van bekostigbare melamien tot premium spuitverf- en handgeverfde afwerkings.\n\nElke kombuis begin met ''n 3D ArtiCAD-ontwerp sodat jy die finale resultaat kan visualiseer voordat ons begin vervaardig. Ons koördineer met boonblad-verskaffers en hanteer die volledige installering."},
        "features": ["Melamine, wrap & spray finishes", "Soft-close hinges & drawers", "Countertop coordination", "3D ArtiCAD design included", "Under-cabinet lighting options"]
      },
      {
        "icon": "🛏️",
        "title": {"en": "Bedroom Cupboards", "af": "Slaapkamerkaste"},
        "description": {"en": "Maximise your bedroom storage with custom built-in wardrobes designed to fit your space perfectly. Choose from sliding doors, hinged doors, or open shelving systems.\n\nWe design the interior to suit your lifestyle — hanging rails, shelving, drawers, shoe racks, and accessories. Walk-in closet designs available for larger spaces.", "af": "Maksimeer jou slaapkamerberging met pasgemaakte ingeboude garderobkaste wat ontwerp is om perfek in jou ruimte te pas. Kies uit skuifdeure, skarniere deure of oop raksisteme.\n\nOns ontwerp die binnekant om by jou leefstyl te pas — hangstawe, rakke, laaie, skoenrakke en bykomstighede. Instapkas-ontwerpe is beskikbaar vir groter ruimtes."},
        "features": ["Sliding & hinged doors", "Custom interior layouts", "Walk-in closet designs", "Mirrored door options", "Lighting integration"]
      },
      {
        "icon": "🚿",
        "title": {"en": "Bathroom Vanities", "af": "Badkamermeubels"},
        "description": {"en": "Custom bathroom vanities and cabinets built with moisture-resistant materials to withstand the bathroom environment. Wall-hung and freestanding options available.\n\nWe also build mirror cabinets, linen cupboards, and other bathroom storage solutions to keep your space organised.", "af": "Pasgemaakte badkamermeubels en -kaste gebou met vogbestande materiale om die badkameromgewing te weerstaan. Muur-gehangde en vrystaande opsies beskikbaar.\n\nOns bou ook spieëlkaste, linnekaste en ander badkamerbergingsoplossings om jou ruimte georganiseerd te hou."},
        "features": ["Moisture-resistant materials", "Wall-hung & freestanding", "Mirror cabinets", "Storage solutions", "Custom sizing"]
      },
      {
        "icon": "📚",
        "title": {"en": "Study & Office", "af": "Studeerkamer & Kantoor"},
        "description": {"en": "Create the perfect home office with custom desks, bookshelves, and built-in storage. We integrate cable management solutions to keep your workspace tidy.\n\nWhether you need a compact study nook or a full home office, we design it to maximise productivity and style.", "af": "Skep die perfekte tuiskantoor met pasgemaakte lessenaars, boekrakke en ingeboude berging. Ons integreer kabelbestuuroplossings om jou werkruimte netjies te hou.\n\nOf jy nou ''n kompakte studeerhoek of ''n volle tuiskantoor nodig het, ons ontwerp dit om produktiwiteit en styl te maksimeer."},
        "features": ["Custom desks & shelving", "Cable management", "Compact to full office", "Built-in storage", "Adjustable shelving"]
      },
      {
        "icon": "🪑",
        "title": {"en": "Loose Furniture", "af": "Los Meubels"},
        "description": {"en": "Freestanding furniture pieces that you can take with you when you move. TV units, sideboards, display cabinets, and entertainment centres — all built to your specifications.", "af": "Vrystaande meubelstukke wat jy saamvat wanneer jy trek. TV-eenhede, dressoirs, vertoonkaste en vermaaksentrums — alles gebou volgens jou spesifikasies."},
        "features": ["TV units & entertainment", "Sideboards & display", "Custom dimensions", "Matching finishes", "Quality hardware"]
      },
      {
        "icon": "🪟",
        "title": {"en": "Security Shutters & Blinds", "af": "Sekuriteitluike & Blindings"},
        "description": {"en": "Complete your home with security shutters and window blinds. We offer aluminium, basswood, plaswood, and bamboo options, including motorised blinds for convenience.\n\nWe measure, supply, and install — ensuring a perfect fit every time.", "af": "Voltooi jou huis met sekuriteitluike en vensterblindings. Ons bied aluminium-, basswood-, plaswood- en bamboes-opsies, insluitend gemotoriseerde blindings vir gerief.\n\nOns meet, verskaf en installeer — om elke keer ''n perfekte passing te verseker."},
        "features": ["Aluminium & wood options", "Motorised available", "Measure, supply & install", "Security shutters", "Custom colours"]
      }
    ]
  }'::jsonb)
on conflict (section_key) do update set content = excluded.content;

-- ─── Site Content (legacy key-value entries) ─────────────────
insert into public.site_content (section_key, content) values
  ('hero_heading', '{"en": "Custom Cupboards. Built to Last.", "af": "Pasgemaakte Kaste. Gebou om te Hou."}'::jsonb),
  ('hero_subheading', '{"en": "20+ years of quality craftsmanship in the Cape Winelands", "af": "20+ jaar se gehalte vakmanskap in die Kaapse Wynland"}'::jsonb),
  ('hero_cta_primary', '{"en": "Get a Free Quote", "af": "Kry ''n Gratis Kwotasie"}'::jsonb),
  ('hero_cta_secondary', '{"en": "View Our Work", "af": "Sien Ons Werk"}'::jsonb),
  ('about_story', '{"en": "With over 20 years of experience in the trade, Nortier Cupboards has built a reputation for quality, reliability, and professional service. Based in Paarl, we design, manufacture, and install custom cupboards for homes across the Cape Winelands and Western Cape. No job is too big or too small — from a single bathroom vanity to a full house of built-in cupboards. We use ArtiCAD design software to give you a 3D preview of your cupboards before we build, so you know exactly what you''re getting.", "af": "Met meer as 20 jaar se ervaring in die bedryf het Nortier Cupboards ''n reputasie gebou vir gehalte, betroubaarheid en professionele diens. Gebaseer in Paarl, ontwerp, vervaardig en installeer ons pasgemaakte kaste vir huise regoor die Kaapse Wynland en Wes-Kaap. Geen werk is te groot of te klein nie — van ''n enkele badkamermeubel tot ''n volle huis se ingeboude kaste. Ons gebruik ArtiCAD-ontwerpsagteware om jou ''n 3D-voorskou van jou kaste te gee voordat ons bou, sodat jy presies weet wat jy kry."}'::jsonb),
  ('trust_strip', '{"en": "20+ Years Experience · Free Quotes · Design to Installation · Paarl & Surrounds", "af": "20+ Jaar Ervaring · Gratis Kwotasies · Ontwerp tot Installering · Paarl & Omgewing"}'::jsonb),
  ('cta_heading', '{"en": "Ready to transform your space?", "af": "Gereed om jou ruimte te transformeer?"}'::jsonb),
  ('cta_text', '{"en": "Get a free, no-obligation quote. We''ll visit, measure, and design your dream cupboards.", "af": "Kry ''n gratis, vryblywende kwotasie. Ons sal besoek, meet en jou droomkaste ontwerp."}'::jsonb)
on conflict (section_key) do update set content = excluded.content;

-- ─── FAQs ────────────────────────────────────────────────────
delete from public.faqs;
insert into public.faqs (question, answer, display_order, is_active) values
  ('{"en": "What areas do you serve?", "af": "Watter gebiede bedien julle?"}'::jsonb,
   '{"en": "We are based in Paarl and serve the greater Cape Winelands and Western Cape region, including Stellenbosch, Franschhoek, Wellington, and surrounding areas.", "af": "Ons is gebaseer in Paarl en bedien die groter Kaapse Wynland en Wes-Kaap-streek, insluitend Stellenbosch, Franschhoek, Wellington en omliggende gebiede."}'::jsonb,
   1, true),
  ('{"en": "How long does a kitchen installation take?", "af": "Hoe lank neem ''n kombuisinstallasie?"}'::jsonb,
   '{"en": "A typical kitchen installation takes 2-4 weeks from final design approval, depending on complexity. We will give you a clear timeline during the quoting process.", "af": "''n Tipiese kombuisinstallasie neem 2-4 weke vanaf finale ontwerpgoedkeuring, afhangende van kompleksiteit. Ons sal jou ''n duidelike tydlyn gee tydens die kwotasieproses."}'::jsonb,
   2, true),
  ('{"en": "Do you provide 3D designs before building?", "af": "Bied julle 3D-ontwerpe aan voor bou?"}'::jsonb,
   '{"en": "Yes! We use ArtiCAD design software to create a detailed 3D preview of your cupboards so you can see exactly what the finished product will look like before we start manufacturing.", "af": "Ja! Ons gebruik ArtiCAD-ontwerpsagteware om ''n gedetailleerde 3D-voorskou van jou kaste te skep sodat jy presies kan sien hoe die finale produk sal lyk voordat ons begin vervaardig."}'::jsonb,
   3, true),
  ('{"en": "How can I get a quote?", "af": "Hoe kan ek ''n kwotasie kry?"}'::jsonb,
   '{"en": "Simply fill out our contact form or give us a call. We will arrange a visit to measure your space and discuss your requirements, then provide a detailed, no-obligation quote.", "af": "Vul eenvoudig ons kontakvorm in of bel ons. Ons sal ''n besoek reël om jou ruimte te meet en jou vereistes te bespreek, en dan ''n gedetailleerde, vryblywende kwotasie verskaf."}'::jsonb,
   4, true),
  ('{"en": "What finishes are available?", "af": "Watter afwerkings is beskikbaar?"}'::jsonb,
   '{"en": "We offer a wide range of finishes including melamine (most affordable), vinyl wrap, spray-painted, and hand-painted. During your consultation, we''ll show you samples and help you choose the best option for your budget and style.", "af": "Ons bied ''n wye verskeidenheid afwerkings aan, insluitend melamien (mees bekostigbaar), vinielomhulsel, spuitverf en handgeverf. Tydens jou konsultasie sal ons jou monsters wys en jou help om die beste opsie vir jou begroting en styl te kies."}'::jsonb,
   5, true),
  ('{"en": "Do you offer a warranty?", "af": "Bied julle ''n waarborg aan?"}'::jsonb,
   '{"en": "Yes, all our cupboard installations come with a workmanship warranty. We stand behind the quality of our work and will address any issues promptly.", "af": "Ja, al ons kasinstallasies kom met ''n vakmanskap-waarborg. Ons staan agter die gehalte van ons werk en sal enige probleme stiptelik aanspreek."}'::jsonb,
   6, true)
on conflict do nothing;

-- ─── Admin User Note ─────────────────────────────────────────
-- To create an admin user:
-- 1. Sign up via the Supabase Auth dashboard or the app's register page
-- 2. Then update the role in user_profiles:
--    UPDATE public.user_profiles SET role = 'admin' WHERE email = 'your-admin@email.com';
-- 3. The custom_access_token_hook will pick up the role on next login.
