# Build 07 — Contact Page + Form API + Email

> **Type:** UI / API / Email  
> **Estimated Time:** 45–60 min  
> **Dependencies:** Build 05 (PageHero), Build 01 (Supabase admin client)  
> **Context Files:** TECHNICAL_DESIGN.md §3.3 + §8, PROJECT_BRIEF.md §3.5

---

## Objective

Build the complete contact page — form with validation, business details, Google Maps, and the API route that saves to Supabase and emails Charl. This is the main lead generation endpoint.

---

## Tasks

### 1. Page Setup

**`src/app/(public)/contact/page.tsx`**:
```typescript
import { Metadata } from 'next'
import { getSettings } from '@/lib/data/settings'
import { getServices } from '@/lib/data/services'
import { getContent } from '@/lib/data/content'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get a free quote for custom cupboards in Paarl and the Cape Winelands. Call, email, WhatsApp, or fill in our quick form.',
}
```

### 2. Page Layout

2-column on desktop, stacked on mobile:
- **Left column (60%):** Contact form
- **Right column (40%):** Contact details + map

```
┌──────────────────────────────────────────────┐
│  PAGE HERO: "Get In Touch"                   │
├──────────────────────┬───────────────────────┤
│                      │                       │
│  CONTACT FORM        │  CONTACT DETAILS      │
│  Name                │  📞 Phone             │
│  Email               │  ✉️ Email              │
│  Phone               │  💬 WhatsApp           │
│  Service interest ▼  │  📍 Address            │
│  Message             │                       │
│  [Send Message]      │  BUSINESS HOURS        │
│                      │  Mon–Fri: 07:30–17:00 │
│                      │  Sat: 08:00–12:00     │
│                      │                       │
│                      │  GOOGLE MAP            │
│                      │  [embed]               │
└──────────────────────┴───────────────────────┘
```

### 3. Contact Form Component

**`src/components/shared/contact-form.tsx`** — Client component:

```typescript
'use client'

interface ContactFormProps {
  services: { slug: string; title: string }[]
  defaultService?: string  // from ?service= query param
  successMessage: string
}
```

Fields:
- **Name** — text input, required
- **Email** — email input, optional (but email OR phone required)
- **Phone** — tel input, optional (but email OR phone required)
- **Service interest** — select dropdown, options from `services` table
  - "Kitchen Cupboards", "Bedroom Cupboards", "Bathroom Vanities", "Study & Office", "Loose Furniture", "Shutters & Blinds", "Other / Not sure"
  - Pre-select if `?service=kitchen-cupboards` in URL
- **Message** — textarea, optional, 4 rows
- **Submit button** — "Send Message", full width on mobile
  - Loading state: spinner + "Sending..."
  - Disabled while submitting

Validation (client-side):
- Name: required, min 2 chars
- Email OR phone: at least one required
- Email: valid format if provided
- Phone: strip spaces, validate SA format loosely if provided

On submit:
```typescript
const res = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
})

if (res.ok) {
  toast.success(successMessage)
  resetForm()
} else {
  const { error } = await res.json()
  toast.error(error || 'Something went wrong. Please try again.')
}
```

### 4. Contact Details Component

**`src/components/shared/contact-details.tsx`** — Server component:

```typescript
interface ContactDetailsProps {
  settings: SiteSettings
}
```

Design:
- Card: `bg-brand-parchment rounded-xl p-6`
- **Phone:** Lucide `Phone` icon + number — `<a href="tel:...">`
- **Email:** Lucide `Mail` icon + email — `<a href="mailto:...">`
- **WhatsApp:** WhatsApp icon + number — `<a href="wa.me/...">`
- **Address:** Lucide `MapPin` icon + full address
- Each row: icon left, text right, full-width divider between

**Business Hours:**
- Below contact details, same card or separate card
- Parse from `business_hours` JSONB in `site_settings`
- Display as simple list: "Mon–Fri: 07:30–17:00" etc.

**Google Maps embed:**
- Below hours
- `<iframe>` from `site_settings.google_maps_embed`
- Rounded corners, aspect-video, full width of column
- If no embed URL: show static "Paarl, Western Cape" text

### 5. API Route

**`src/app/api/contact/route.ts`**:

```typescript
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { Resend } from 'resend'
import { ContactNotificationEmail } from '@/lib/email/contact-notification'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate
    if (!body.name || body.name.trim().length < 2) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    if (!body.email && !body.phone) {
      return NextResponse.json({ error: 'Please provide an email or phone number' }, { status: 400 })
    }
    if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Sanitize
    const sanitize = (str?: string) => str?.trim().slice(0, 1000) || null

    // Insert into DB
    const { error: dbError } = await supabaseAdmin
      .from('contact_submissions')
      .insert({
        name: sanitize(body.name)!,
        email: sanitize(body.email),
        phone: sanitize(body.phone),
        service_interest: sanitize(body.service_interest),
        message: sanitize(body.message),
        source: 'website',
      })

    if (dbError) {
      console.error('DB error:', dbError)
      return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
    }

    // Get business email from settings
    const { data: settings } = await supabaseAdmin
      .from('site_settings')
      .select('email')
      .limit(1)
      .single()

    // Send email notification
    if (settings?.email) {
      try {
        await resend.emails.send({
          from: 'Nortier Website <noreply@nortiercupboards.co.za>',
          to: settings.email,
          subject: `New Quote Request from ${body.name}`,
          react: ContactNotificationEmail({
            name: body.name,
            email: body.email,
            phone: body.phone,
            service: body.service_interest,
            message: body.message,
          }),
        })
      } catch (emailErr) {
        // Log but don't fail the request — lead is saved
        console.error('Email error:', emailErr)
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
```

### 6. Email Template

**`src/lib/email/contact-notification.tsx`** — React Email:

```typescript
import { Html, Head, Body, Container, Section, Text, Hr, Link } from '@react-email/components'

interface Props {
  name: string
  email?: string | null
  phone?: string | null
  service?: string | null
  message?: string | null
}

export function ContactNotificationEmail({ name, email, phone, service, message }: Props) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f0eb' }}>
        <Container style={{ maxWidth: 560, margin: '0 auto', padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#2C2C2C' }}>
            New Quote Request
          </Text>
          <Hr />
          <Section>
            <Text><strong>Name:</strong> {name}</Text>
            {phone && <Text><strong>Phone:</strong> {phone}</Text>}
            {email && <Text><strong>Email:</strong> {email}</Text>}
            {service && <Text><strong>Interested in:</strong> {service}</Text>}
          </Section>
          {message && (
            <Section>
              <Text><strong>Message:</strong></Text>
              <Text style={{ whiteSpace: 'pre-wrap' }}>{message}</Text>
            </Section>
          )}
          <Hr />
          <Text style={{ fontSize: 12, color: '#6B6560' }}>
            Received from nortiercupboards.co.za
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
```

### 7. WhatsApp FAB Offset

On the contact page, add extra bottom padding or offset the WhatsApp FAB so it doesn't overlap the form submit button. Option: detect `/contact` via `usePathname()` and add `mb-24` to form container, or shift FAB up.

---

## Acceptance Criteria

```
✅ Contact page renders at /contact with correct metadata
✅ Contact form displays all fields (name, email, phone, service dropdown, message)
✅ Service dropdown pre-selects from ?service= query param
✅ Client-side validation: name required, email OR phone required
✅ Form submits to /api/contact
✅ API validates, sanitizes, inserts into contact_submissions
✅ API sends email notification via Resend
✅ Email template shows all form data
✅ Success toast displays on successful submission
✅ Error toast displays on failure
✅ Form resets after successful submission
✅ Contact details display phone, email, WhatsApp, address from site_settings
✅ Business hours display from site_settings JSONB
✅ Google Maps embed renders (or placeholder if no embed URL)
✅ WhatsApp FAB doesn't overlap submit button
✅ Responsive: 2-col → stacked on mobile
```
