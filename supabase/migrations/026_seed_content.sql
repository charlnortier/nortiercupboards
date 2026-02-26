-- ============================================================
-- 026_seed_content.sql — Seed FAQ, Terms, Privacy, SEO, Homepage
-- Populates initial content for Nortier Cupboards
-- ============================================================

-- ─── FAQs ────────────────────────────────────────────────────

INSERT INTO faqs (question, answer, display_order, is_active) VALUES
(
  '{"en":"How long does a typical cupboard project take?","af":"Hoe lank neem ''n tipiese kassprojek?"}',
  '{"en":"Most kitchen and bedroom cupboard projects take 4–6 weeks from design to installation. This includes the initial consultation, design approval, manufacturing, and on-site fitting. Larger or more complex projects may take slightly longer.","af":"Die meeste kombuis- en slaapkamerkassprojekte neem 4–6 weke van ontwerp tot installering. Dit sluit die aanvanklike konsultasie, ontwerpgoedkeuring, vervaardiging en terreinpassing in."}',
  0, true
),
(
  '{"en":"Do you offer free quotations?","af":"Bied julle gratis kwotasies aan?"}',
  '{"en":"Yes! We offer free, no-obligation quotations. Simply contact us or fill in the form on our contact page, and we''ll arrange a convenient time to visit your home, take measurements, and discuss your requirements.","af":"Ja! Ons bied gratis, vryblywende kwotasies aan. Kontak ons of vul die vorm op ons kontakbladsy in, en ons sal ''n gerieflike tyd reël om jou huis te besoek, afmetings te neem en jou vereistes te bespreek."}',
  1, true
),
(
  '{"en":"What areas do you service?","af":"Watter gebiede bedien julle?"}',
  '{"en":"We primarily service the Paarl, Stellenbosch, Franschhoek, and greater Cape Winelands area. We also take on projects in the broader Western Cape — contact us to discuss your location.","af":"Ons bedien hoofsaaklik die Paarl, Stellenbosch, Franschhoek en groter Kaapse Wynland-area. Ons neem ook projekte in die breër Wes-Kaap aan — kontak ons om jou ligging te bespreek."}',
  2, true
),
(
  '{"en":"What materials do you work with?","af":"Met watter materiale werk julle?"}',
  '{"en":"We work with a wide range of materials including melamine-faced board, solid wood, high-gloss finishes, vinyl wrap, and natural wood veneers. During the design phase, we''ll help you choose the best material for your budget and style.","af":"Ons werk met ''n wye verskeidenheid materiale insluitend melamienbeklede bord, soliede hout, hoëglansafwerkings, vinielomhulsel en natuurlike houtfineer. Tydens die ontwerpfase sal ons jou help om die beste materiaal vir jou begroting en styl te kies."}',
  3, true
),
(
  '{"en":"Can you design cupboards for unusual spaces?","af":"Kan julle kaste vir ongewone ruimtes ontwerp?"}',
  '{"en":"Absolutely. Custom design is our speciality. Whether you have an awkward corner, sloped ceiling, or non-standard dimensions, we design and build to fit your exact space. Every project is made to measure.","af":"Absoluut. Pasgemaakte ontwerp is ons spesialiteit. Of jy ''n moeilike hoek, skuins plafon of nie-standaard afmetings het — ons ontwerp en bou om by jou presiese ruimte te pas. Elke projek word op maat gemaak."}',
  4, true
),
(
  '{"en":"Do you offer a warranty on your work?","af":"Bied julle ''n waarborg op julle werk?"}',
  '{"en":"Yes. All our cupboard installations come with a workmanship warranty. We stand behind the quality of our materials and craftsmanship. If any issues arise after installation, we''ll address them promptly.","af":"Ja. Al ons kasinstallasies kom met ''n vakmanskap-waarborg. Ons staan agter die gehalte van ons materiale en vakmanskap. As enige probleme na installering opduik, sal ons dit stiptelik aanspreek."}',
  5, true
),
(
  '{"en":"How do I get started?","af":"Hoe begin ek?"}',
  '{"en":"Getting started is easy — simply contact us via our website, phone, or WhatsApp. We''ll schedule a free consultation at your home, discuss your ideas, take measurements, and provide a detailed quotation within a few days.","af":"Om te begin is maklik — kontak ons eenvoudig via ons webwerf, telefoon of WhatsApp. Ons sal ''n gratis konsultasie by jou huis skeduleer, jou idees bespreek, afmetings neem en binne ''n paar dae ''n gedetailleerde kwotasie verskaf."}',
  6, true
);

-- ─── Terms & Conditions ─────────────────────────────────────

INSERT INTO site_content (section_key, content) VALUES
(
  'terms',
  '{
    "heading": {"en": "Terms of Service", "af": "Diensvoorwaardes"},
    "updated_at": "2026-02-01",
    "body": {"en": "Welcome to Nortier Cupboards. By using our website or engaging our services, you agree to the following terms.\n\n1. Services\nNortier Cupboards provides custom cupboard design, manufacturing, and installation services in the Western Cape, South Africa. All work is subject to a signed quotation and agreement.\n\n2. Quotations & Pricing\nQuotations are valid for 30 days from the date of issue. Prices are quoted in South African Rand (ZAR) and include VAT where applicable. Final pricing may vary if the scope of work changes after the quotation is accepted.\n\n3. Payment Terms\nA 50% deposit is required before manufacturing begins. The remaining balance is due upon completion of installation. Payment can be made via EFT or cash.\n\n4. Manufacturing & Delivery\nEstimated timelines are provided at the time of quotation. While we strive to meet all deadlines, delays may occur due to material availability or unforeseen circumstances. We will communicate any changes promptly.\n\n5. Warranty\nAll installations carry a workmanship warranty. This covers defects in construction and fitting but does not cover damage caused by misuse, water damage, or normal wear and tear.\n\n6. Cancellation\nCancellations made after manufacturing has commenced may be subject to a cancellation fee to cover materials and labour already incurred.\n\n7. Intellectual Property\nAll designs created by Nortier Cupboards remain our intellectual property until full payment is received. Designs may not be shared with third parties without our written consent.\n\n8. Limitation of Liability\nNortier Cupboards shall not be liable for indirect, incidental, or consequential damages arising from the use of our services.\n\n9. Governing Law\nThese terms are governed by the laws of the Republic of South Africa.\n\n10. Contact\nFor questions about these terms, please contact us via our website or call us directly.", "af": "Welkom by Nortier Cupboards. Deur ons webwerf te gebruik of ons dienste te gebruik, stem jy in tot die volgende voorwaardes.\n\n1. Dienste\nNortier Cupboards bied pasgemaakte kasontwerp-, vervaardigings- en installeringsdienste in die Wes-Kaap, Suid-Afrika. Alle werk is onderworpe aan ''n ondertekende kwotasie en ooreenkoms.\n\n2. Kwotasies en Pryse\nKwotasies is 30 dae geldig vanaf die datum van uitreiking. Pryse word in Suid-Afrikaanse Rand (ZAR) gekwoteer en sluit BTW in waar van toepassing.\n\n3. Betalingsvoorwaardes\n''n 50% deposito word vereis voordat vervaardiging begin. Die oorblywende saldo is betaalbaar by voltooiing van installering.\n\n4. Vervaardiging en Aflewering\nGeskatte tydlyne word ten tyde van kwotasie verskaf. Terwyl ons daarna streef om alle spertye na te kom, kan vertragings voorkom.\n\n5. Waarborg\nAlle installasies dra ''n vakmanskap-waarborg. Dit dek defekte in konstruksie en passing.\n\n6. Kansellasie\nKansellasies wat gemaak word nadat vervaardiging begin het, mag onderhewig wees aan ''n kansellasiefooi.\n\n7. Intellektuele Eiendom\nAlle ontwerpe bly ons intellektuele eiendom totdat volle betaling ontvang is.\n\n8. Beperking van Aanspreeklikheid\nNortier Cupboards sal nie aanspreeklik wees vir indirekte of gevolgskade nie.\n\n9. Geldende Reg\nHierdie voorwaardes word beheer deur die wette van die Republiek van Suid-Afrika.\n\n10. Kontak\nVir vrae oor hierdie voorwaardes, kontak ons asseblief via ons webwerf."}
  }'::jsonb
)
ON CONFLICT (section_key) DO UPDATE SET content = EXCLUDED.content, updated_at = now();

-- ─── Privacy Policy ─────────────────────────────────────────

INSERT INTO site_content (section_key, content) VALUES
(
  'privacy',
  '{
    "heading": {"en": "Privacy Policy", "af": "Privaatheidsbeleid"},
    "updated_at": "2026-02-01",
    "body": {"en": "Nortier Cupboards (\"we\", \"us\", \"our\") is committed to protecting your personal information in accordance with the Protection of Personal Information Act (POPIA) of South Africa.\n\n1. Information We Collect\nWe may collect the following personal information when you contact us or use our services:\n- Full name and surname\n- Email address\n- Phone number\n- Physical address (for project site visits)\n- Project details and preferences\n\n2. How We Use Your Information\nWe use your information to:\n- Respond to enquiries and provide quotations\n- Schedule consultations and site visits\n- Manufacture and install your cupboards\n- Send project updates and follow-ups\n- Improve our website and services\n\n3. Information Sharing\nWe do not sell, trade, or share your personal information with third parties, except:\n- When required by law\n- With trusted suppliers involved in your project (with your consent)\n- With service providers who assist our website operations\n\n4. Data Security\nWe implement appropriate technical and organisational measures to protect your personal information against unauthorised access, loss, or destruction.\n\n5. Your Rights Under POPIA\nYou have the right to:\n- Request access to your personal information\n- Request correction or deletion of your data\n- Object to the processing of your information\n- Lodge a complaint with the Information Regulator\n\n6. Cookies\nOur website may use cookies to enhance your browsing experience. You can disable cookies in your browser settings.\n\n7. Contact\nFor privacy-related enquiries or to exercise your rights, contact us via our website or email us directly.\n\nThis policy may be updated from time to time. The latest version will always be available on this page.", "af": "Nortier Cupboards (\"ons\") is daartoe verbind om jou persoonlike inligting te beskerm in ooreenstemming met die Wet op die Beskerming van Persoonlike Inligting (POPIA) van Suid-Afrika.\n\n1. Inligting Wat Ons Versamel\nOns kan die volgende persoonlike inligting versamel wanneer jy ons kontak of ons dienste gebruik:\n- Volle naam en van\n- E-posadres\n- Telefoonnommer\n- Fisiese adres (vir projekbesoeke)\n- Projekbesonderhede en voorkeure\n\n2. Hoe Ons Jou Inligting Gebruik\nOns gebruik jou inligting om:\n- Op navrae te reageer en kwotasies te verskaf\n- Konsultasies en terreinbesoeke te skeduleer\n- Jou kaste te vervaardig en te installeer\n- Projekopdaterings en opvolgings te stuur\n- Ons webwerf en dienste te verbeter\n\n3. Inligting Deel\nOns verkoop, verhandel of deel nie jou persoonlike inligting met derde partye nie, behalwe wanneer dit deur die wet vereis word.\n\n4. Datasekuriteit\nOns implementeer toepaslike tegniese en organisatoriese maatreëls om jou persoonlike inligting te beskerm.\n\n5. Jou Regte Onder POPIA\nJy het die reg om:\n- Toegang tot jou persoonlike inligting te versoek\n- Regstelling of skrapping van jou data te versoek\n- Beswaar te maak teen die verwerking van jou inligting\n\n6. Koekies\nOns webwerf kan koekies gebruik om jou blaai-ervaring te verbeter.\n\n7. Kontak\nVir privaatheidsverwante navrae, kontak ons via ons webwerf.\n\nHierdie beleid kan van tyd tot tyd opgedateer word."}
  }'::jsonb
)
ON CONFLICT (section_key) DO UPDATE SET content = EXCLUDED.content, updated_at = now();

-- ─── About Page Content ─────────────────────────────────────

INSERT INTO site_content (section_key, content) VALUES
(
  'about',
  '{
    "heading": {"en": "About Nortier Cupboards", "af": "Oor Nortier Cupboards"},
    "mission": {"en": "Quality craftsmanship, honest service, and cupboards built to last a lifetime.", "af": "Gehalte vakmanskap, eerlike diens, en kaste gebou om ''n leeftyd te hou."},
    "body": {"en": "Nortier Cupboards was founded over 20 years ago in Paarl, in the heart of the Cape Winelands. What started as a small workshop has grown into a trusted name in custom cupboard design, manufacturing, and installation across the Western Cape.\n\nEvery project begins with a personal consultation. We visit your home, listen to your ideas, and take careful measurements. Our design process ensures that every cupboard fits your space perfectly — no gaps, no compromises.\n\nWe manufacture all our cupboards in our own workshop using quality materials sourced from trusted South African suppliers. This means we can control every step of the process, from cutting and edging to assembly and finishing.\n\nOur team of experienced fitters handles the installation with care and precision. We treat your home with respect, working cleanly and efficiently to minimise disruption. We don''t leave until you''re completely satisfied.", "af": "Nortier Cupboards is meer as 20 jaar gelede in Paarl, in die hart van die Kaapse Wynland, gestig. Wat as ''n klein werkswinkel begin het, het gegroei tot ''n vertroude naam in pasgemaakte kasontwerp, vervaardiging en installering regoor die Wes-Kaap.\n\nElke projek begin met ''n persoonlike konsultasie. Ons besoek jou huis, luister na jou idees en neem sorgvuldige afmetings. Ons ontwerpproses verseker dat elke kas perfek in jou ruimte pas.\n\nOns vervaardig al ons kaste in ons eie werkswinkel met gehalte materiale. Dit beteken ons kan elke stap van die proses beheer, van sny en bording tot samestelling en afwerking.\n\nOns span van ervare monteerders hanteer die installering met sorg en presisie. Ons behandel jou huis met respek en werk skoon en doeltreffend."},
    "process": [
      {"step": "1", "title": {"en": "Consultation", "af": "Konsultasie"}, "description": {"en": "We visit your home, discuss your needs, and take measurements.", "af": "Ons besoek jou huis, bespreek jou behoeftes en neem afmetings."}},
      {"step": "2", "title": {"en": "Design", "af": "Ontwerp"}, "description": {"en": "We create a detailed design and provide a comprehensive quotation.", "af": "Ons skep ''n gedetailleerde ontwerp en verskaf ''n omvattende kwotasie."}},
      {"step": "3", "title": {"en": "Manufacturing", "af": "Vervaardiging"}, "description": {"en": "Your cupboards are built in our workshop using quality materials.", "af": "Jou kaste word in ons werkswinkel gebou met gehalte materiale."}},
      {"step": "4", "title": {"en": "Installation", "af": "Installering"}, "description": {"en": "Our team installs everything with precision and care.", "af": "Ons span installeer alles met presisie en sorg."}}
    ],
    "values": [
      {"title": {"en": "Quality Craftsmanship", "af": "Gehalte Vakmanskap"}, "description": {"en": "Every cupboard is built with attention to detail and pride in our work.", "af": "Elke kas word gebou met aandag aan detail en trots in ons werk."}},
      {"title": {"en": "Honest Pricing", "af": "Eerlike Pryse"}, "description": {"en": "No hidden costs. What we quote is what you pay.", "af": "Geen versteekte koste nie. Wat ons kwoteer, is wat jy betaal."}},
      {"title": {"en": "On-Time Delivery", "af": "Tydige Aflewering"}, "description": {"en": "We respect your time and stick to agreed timelines.", "af": "Ons respekteer jou tyd en hou by ooreengekome tydlyne."}},
      {"title": {"en": "Local & Personal", "af": "Plaaslik en Persoonlik"}, "description": {"en": "We are a family business that values personal relationships.", "af": "Ons is ''n familiesaak wat persoonlike verhoudings waardeer."}}
    ],
    "service_area": {"en": "We primarily service the Paarl, Stellenbosch, Franschhoek, and greater Cape Winelands area. We also take on projects across the broader Western Cape — contact us to discuss your location.", "af": "Ons bedien hoofsaaklik die Paarl, Stellenbosch, Franschhoek en groter Kaapse Wynland-area. Ons neem ook projekte regoor die breër Wes-Kaap aan — kontak ons om jou ligging te bespreek."}
  }'::jsonb
)
ON CONFLICT (section_key) DO UPDATE SET content = EXCLUDED.content, updated_at = now();

-- ─── Homepage Sections ──────────────────────────────────────

INSERT INTO homepage_sections (section_key, content, display_order, is_active) VALUES
(
  'hero',
  '{
    "heading": {"en": "Custom Cupboards, Built to Last", "af": "Pasgemaakte Kaste, Gebou om te Hou"},
    "subheading": {"en": "Over 20 years of expert craftsmanship in the Cape Winelands. From kitchens to bedrooms, we design and build cupboards that transform your space.", "af": "Meer as 20 jaar se vakkundige vakmanskap in die Kaapse Wynland. Van kombuise tot slaapkamers, ons ontwerp en bou kaste wat jou ruimte transformeer."},
    "cta_text": {"en": "Get a Free Quote", "af": "Kry ''n Gratis Kwotasie"},
    "cta_url": "/contact",
    "cta_secondary_text": {"en": "View Our Work", "af": "Sien Ons Werk"},
    "cta_secondary_url": "/portfolio",
    "background_image": ""
  }'::jsonb,
  0, true
),
(
  'trust_stats',
  '{
    "items": [
      {"icon": "🏠", "value": "20+", "label": {"en": "Years Experience", "af": "Jaar Ervaring"}},
      {"icon": "⭐", "value": "500+", "label": {"en": "Projects Completed", "af": "Projekte Voltooi"}},
      {"icon": "🔧", "value": "100%", "label": {"en": "Custom Built", "af": "Pasgemaak"}},
      {"icon": "📍", "value": "Paarl", "label": {"en": "Based in the Winelands", "af": "Gebaseer in die Wynland"}}
    ]
  }'::jsonb,
  1, true
),
(
  'services',
  '{
    "heading": {"en": "Our Services", "af": "Ons Dienste"},
    "subheading": {"en": "From design to installation, we handle every detail of your cupboard project.", "af": "Van ontwerp tot installering, ons hanteer elke detail van jou kasprojek."},
    "items": [
      {"icon": "🍳", "title": {"en": "Kitchen Cupboards", "af": "Kombuiskaste"}, "description": {"en": "Functional, beautiful kitchen cabinetry designed around your cooking style and space.", "af": "Funksionele, pragtige kombuiskaste ontwerp rondom jou kookstyl en ruimte."}},
      {"icon": "🛏️", "title": {"en": "Bedroom Cupboards", "af": "Slaapkamerkaste"}, "description": {"en": "Built-in wardrobes and closets that maximise storage and complement your bedroom design.", "af": "Ingeboude garderobkaste wat berging maksimeer en jou slaapkamerontwerp aanvul."}},
      {"icon": "🚿", "title": {"en": "Bathroom Vanities", "af": "Badkamermeubels"}, "description": {"en": "Custom vanity units and storage solutions for bathrooms of any size.", "af": "Pasgemaakte meubeleenhede en bergingsoplossings vir badkamers van enige grootte."}},
      {"icon": "📺", "title": {"en": "Entertainment Units", "af": "Vermaakeenhede"}, "description": {"en": "Wall units, TV cabinets, and display shelving built to your exact specifications.", "af": "Muureenhede, TV-kaste en vertoonrakke gebou volgens jou presiese spesifikasies."}},
      {"icon": "🏢", "title": {"en": "Office & Study", "af": "Kantoor en Studeerkamer"}, "description": {"en": "Desks, bookshelves, and built-in storage to create your ideal workspace.", "af": "Lessenaars, boekrakke en ingeboude berging om jou ideale werkruimte te skep."}},
      {"icon": "✨", "title": {"en": "Renovations", "af": "Opknappings"}, "description": {"en": "Refresh existing cupboards with new doors, countertops, or a complete makeover.", "af": "Verfris bestaande kaste met nuwe deure, boonblaaie of ''n volledige opknapping."}}
    ]
  }'::jsonb,
  2, true
),
(
  'about',
  '{
    "heading": {"en": "About Nortier Cupboards", "af": "Oor Nortier Cupboards"},
    "body": {"en": "With over 20 years of experience in the cupboard industry, Nortier Cupboards has built a reputation for quality craftsmanship, attention to detail, and reliable service. Based in Paarl, we serve homeowners across the Cape Winelands and greater Western Cape. Every project is custom-designed and built to your exact specifications.", "af": "Met meer as 20 jaar se ervaring in die kasindustrie het Nortier Cupboards ''n reputasie gebou vir gehalte vakmanskap, aandag aan detail en betroubare diens. Gebaseer in Paarl, bedien ons huiseienaars regoor die Kaapse Wynland en groter Wes-Kaap."},
    "image": ""
  }'::jsonb,
  3, true
),
(
  'cta',
  '{
    "heading": {"en": "Ready to Transform Your Space?", "af": "Gereed om Jou Ruimte te Transformeer?"},
    "body": {"en": "Contact us today for a free, no-obligation quotation. We''ll visit your home, discuss your vision, and bring your dream cupboards to life.", "af": "Kontak ons vandag vir ''n gratis, vryblywende kwotasie. Ons sal jou huis besoek, jou visie bespreek en jou droomkaste tot lewe bring."},
    "button_text": {"en": "Contact Us", "af": "Kontak Ons"},
    "button_url": "/contact"
  }'::jsonb,
  4, true
)
ON CONFLICT (section_key) DO UPDATE SET
  content = EXCLUDED.content,
  display_order = EXCLUDED.display_order,
  updated_at = now();

-- ─── Page SEO ───────────────────────────────────────────────

INSERT INTO page_seo (page_key, title, description, keywords, og_type, priority, changefreq) VALUES
(
  'home',
  '{"en": "Nortier Cupboards — Custom Cupboard Design & Installation in Paarl", "af": "Nortier Cupboards — Pasgemaakte Kasontwerp en Installering in Paarl"}',
  '{"en": "Custom cupboard design, manufacture and installation in Paarl and the Cape Winelands. 20+ years experience. Kitchen, bedroom, bathroom and office cabinetry.", "af": "Pasgemaakte kasontwerp, vervaardiging en installering in Paarl en die Kaapse Wynland. 20+ jaar ervaring."}',
  'cupboards, custom cupboards, kitchen cupboards, Paarl, Cape Winelands, cabinetry, built-in cupboards',
  'website', 1.0, 'weekly'
),
(
  'about',
  '{"en": "About Us — Nortier Cupboards", "af": "Oor Ons — Nortier Cupboards"}',
  '{"en": "Learn about Nortier Cupboards — over 20 years of custom cupboard design and installation in the Cape Winelands. Our story, process, and values.", "af": "Leer meer oor Nortier Cupboards — meer as 20 jaar se pasgemaakte kasontwerp en installering in die Kaapse Wynland."}',
  'about Nortier Cupboards, cupboard company Paarl, custom cabinetry Western Cape',
  'website', 0.7, 'monthly'
),
(
  'services',
  '{"en": "Our Services — Nortier Cupboards", "af": "Ons Dienste — Nortier Cupboards"}',
  '{"en": "Kitchen cupboards, bedroom built-ins, bathroom vanities, entertainment units, office furniture, and renovations. Custom-designed and built in Paarl.", "af": "Kombuiskaste, slaapkamer-ingeboude kaste, badkamermeubels, vermaakeenhede, kantoormeubels en opknappings."}',
  'kitchen cupboards, bedroom cupboards, bathroom vanities, renovations, Paarl, custom cabinetry',
  'website', 0.8, 'monthly'
),
(
  'contact',
  '{"en": "Contact Us — Nortier Cupboards", "af": "Kontak Ons — Nortier Cupboards"}',
  '{"en": "Get in touch with Nortier Cupboards for a free quotation. Visit us in Paarl or contact us by phone, email, or WhatsApp.", "af": "Kontak Nortier Cupboards vir ''n gratis kwotasie. Besoek ons in Paarl of kontak ons per telefoon, e-pos of WhatsApp."}',
  'contact Nortier Cupboards, free quote cupboards Paarl, cupboard installation enquiry',
  'website', 0.8, 'monthly'
),
(
  'portfolio',
  '{"en": "Our Work — Nortier Cupboards Portfolio", "af": "Ons Werk — Nortier Cupboards Portefeulje"}',
  '{"en": "Browse our portfolio of completed cupboard projects — kitchens, bedrooms, bathrooms, and more. See the quality of our craftsmanship.", "af": "Blaai deur ons portefeulje van voltooide kasprojekte — kombuise, slaapkamers, badkamers en meer."}',
  'cupboard portfolio, kitchen projects, custom cupboard gallery, Paarl projects',
  'website', 0.7, 'weekly'
),
(
  'faq',
  '{"en": "FAQ — Nortier Cupboards", "af": "Gereelde Vrae — Nortier Cupboards"}',
  '{"en": "Frequently asked questions about custom cupboard design, manufacturing, installation timelines, materials, pricing, and warranty.", "af": "Gereelde vrae oor pasgemaakte kasontwerp, vervaardiging, installeringstydlyne, materiale, pryse en waarborg."}',
  'cupboard FAQ, custom cupboard questions, installation timeline, cupboard warranty',
  'website', 0.5, 'monthly'
),
(
  'terms',
  '{"en": "Terms of Service — Nortier Cupboards", "af": "Diensvoorwaardes — Nortier Cupboards"}',
  '{"en": "Terms of service for Nortier Cupboards. Payment terms, warranty, cancellation policy, and governing law.", "af": "Diensvoorwaardes vir Nortier Cupboards. Betalingsvoorwaardes, waarborg, kansellasiebeleid en geldende reg."}',
  NULL,
  'website', 0.3, 'yearly'
),
(
  'privacy',
  '{"en": "Privacy Policy — Nortier Cupboards", "af": "Privaatheidsbeleid — Nortier Cupboards"}',
  '{"en": "Privacy policy for Nortier Cupboards. How we collect, use, and protect your personal information under POPIA.", "af": "Privaatheidsbeleid vir Nortier Cupboards. Hoe ons jou persoonlike inligting versamel, gebruik en beskerm onder POPIA."}',
  NULL,
  'website', 0.3, 'yearly'
)
ON CONFLICT (page_key) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  og_type = EXCLUDED.og_type,
  priority = EXCLUDED.priority,
  changefreq = EXCLUDED.changefreq,
  updated_at = now();
