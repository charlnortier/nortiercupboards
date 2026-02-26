# Build 12 — Admin: Leads Viewer + Content Editor + Settings

> **Type:** Admin / CRUD  
> **Estimated Time:** 45–60 min  
> **Dependencies:** Build 10 (admin layout + auth)  
> **Context Files:** TECHNICAL_DESIGN.md §5.2

---

## Objective

Build the three remaining admin pages — leads management, site content editor, and business settings. These are simpler than the projects page (no file uploads, no complex relations) so they're grouped into one build.

---

## Tasks

### 1. Leads Viewer

**`src/app/(admin)/admin/leads/page.tsx`** — Server component:

```typescript
import { createClient } from '@/lib/supabase/server'
import { LeadsTable } from '@/components/admin/leads-table'

export default async function AdminLeadsPage() {
  const supabase = await createClient()
  const { data: leads } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Leads</h1>
        <StatusFilter />  {/* filter pills: All, New, Contacted, Closed */}
      </div>
      <LeadsTable leads={leads ?? []} />
    </div>
  )
}
```

**`src/components/admin/leads-table.tsx`** — Client component:

Design:
- Table layout on desktop, card layout on mobile
- Columns: Name, Email/Phone, Service, Date, Status, Actions
- **Status badges** (coloured pills):
  - `new` → `bg-brand-camel/20 text-brand-camel-dark` (warm — attention needed)
  - `read` → `bg-brand-navy-pale text-brand-navy-light`
  - `contacted` → `bg-green-100 text-green-700`
  - `quoted` → `bg-purple-100 text-purple-700`
  - `closed` → `bg-gray-100 text-gray-500`
- **Click row → expand** details panel below the row (accordion style):
  - Full message text
  - Admin notes textarea (save on blur or explicit save button)
  - Status dropdown (select → update immediately)
  - Timestamp: "Received 3 days ago" + exact date
  - Quick actions: "Call" (tel: link), "Email" (mailto: link), "WhatsApp" (wa.me link)
- **Auto-mark as read:** when expanding a `new` lead, update `status` to `read` and set `read_at`
- **Filter bar** at top: pills for All | New | Read | Contacted | Quoted | Closed
  - Client-side filter (same pattern as gallery filter)
  - "New" pill shows count badge if > 0
- **Empty state:** "No leads yet. They'll appear here when someone fills in your contact form."
- **Sort:** newest first (default), optionally toggle oldest first

Status update:
```typescript
const updateStatus = async (leadId: string, newStatus: string) => {
  await supabase
    .from('contact_submissions')
    .update({
      status: newStatus,
      ...(newStatus === 'read' ? { read_at: new Date().toISOString() } : {}),
    })
    .eq('id', leadId)
  router.refresh()
}
```

Notes save:
```typescript
const saveNotes = async (leadId: string, notes: string) => {
  await supabase
    .from('contact_submissions')
    .update({ notes })
    .eq('id', leadId)
  toast.success('Notes saved')
}
```

### 2. Content Editor

**`src/app/(admin)/admin/content/page.tsx`** — Server component:

```typescript
export default async function AdminContentPage() {
  const supabase = await createClient()
  const { data: content } = await supabase
    .from('site_content')
    .select('*')
    .order('page')
    .order('sort_order')

  // Group by page
  const grouped = groupBy(content ?? [], 'page')
  // { home: [...], about: [...], contact: [...] }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Site Content</h1>
      <ContentEditor groups={grouped} />
    </div>
  )
}
```

**`src/components/admin/content-editor.tsx`** — Client component:

Design:
- **Tabs** for each page: Home, About, Contact (use shadcn Tabs)
- Each tab shows a list of editable content blocks
- Each block:
  - **Label:** section name humanised (e.g. `hero_title` → "Hero Title")
  - **Input:** textarea for long text, text input for short text
    - Detect: if value length > 100 → textarea (4 rows), else → text input
  - **Save button** per field: "Save" — small, appears only when field is dirty (changed)
  - Or: single "Save All Changes" button at bottom of each tab
- **Humanise section names:**
```typescript
const humanise = (section: string) =>
  section
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
// 'hero_title' → 'Hero Title'
// 'process_step1' → 'Process Step1' (good enough)
```

Save:
```typescript
const saveContent = async (id: string, value: string) => {
  await supabase
    .from('site_content')
    .update({ value, updated_at: new Date().toISOString() })
    .eq('id', id)
  toast.success('Saved')
}
```

Optional: trigger ISR revalidation after save:
```typescript
// Call a revalidation API route
await fetch('/api/revalidate', {
  method: 'POST',
  body: JSON.stringify({ paths: ['/', '/about'] }),
})
```

**`src/app/api/revalidate/route.ts`** (simple):
```typescript
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { paths } = await req.json()
  for (const path of paths) {
    revalidatePath(path)
  }
  return NextResponse.json({ revalidated: true })
}
```

### 3. Settings Page

**`src/app/(admin)/admin/settings/page.tsx`** — Server component + client form:

```typescript
export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .single()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Settings</h1>
      <SettingsForm settings={settings} />
    </div>
  )
}
```

**`src/components/admin/settings-form.tsx`** — Client component:

Design:
- Single card form, grouped into sections with headings:

**Business Details:**
- Business name — text input
- Tagline — text input

**Contact Information:**
- Phone — tel input
- Email — email input
- WhatsApp number — tel input (with helper text: "Include country code, e.g. 27831234567")

**Address:**
- Address line 1 — text input
- Address line 2 — text input
- City — text input (default: Paarl)
- Province — text input (default: Western Cape)
- Postal code — text input

**Online:**
- Google Maps embed code — textarea (paste iframe code)
- Facebook URL — url input
- Instagram URL — url input

**Business Hours:**
- Mon–Fri — text input (default: "07:30 – 17:00")
- Saturday — text input (default: "08:00 – 12:00 (by appointment)")
- Sunday — text input (default: "Closed")
- Stored as JSONB, parsed into individual fields, reassembled on save

**Save button:** "Save Settings" — bottom of form, full width on mobile
- Loading state during save
- Success toast: "Settings saved"

Save:
```typescript
const saveSettings = async (formData: SettingsFormData) => {
  await supabase
    .from('site_settings')
    .update({
      business_name: formData.businessName,
      tagline: formData.tagline,
      phone: formData.phone,
      email: formData.email,
      whatsapp: formData.whatsapp,
      address_line1: formData.addressLine1,
      address_line2: formData.addressLine2,
      city: formData.city,
      province: formData.province,
      postal_code: formData.postalCode,
      google_maps_embed: formData.googleMapsEmbed,
      facebook_url: formData.facebookUrl,
      instagram_url: formData.instagramUrl,
      business_hours: {
        mon_fri: formData.monFri,
        sat: formData.sat,
        sun: formData.sun,
      },
      updated_at: new Date().toISOString(),
    })
    .eq('id', settings.id)

  toast.success('Settings saved')
  // Trigger revalidation of all public pages
  await fetch('/api/revalidate', {
    method: 'POST',
    body: JSON.stringify({ paths: ['/', '/about', '/contact', '/services', '/gallery'] }),
  })
}
```

---

## Acceptance Criteria

```
LEADS:
✅ /admin/leads shows all contact submissions, newest first
✅ Status badges are colour-coded
✅ Click row expands to show full message + notes
✅ Status dropdown updates immediately
✅ Notes field saves (on blur or explicit save)
✅ Auto-marks 'new' leads as 'read' when expanded
✅ Filter pills work (All, New, Read, Contacted, etc.)
✅ "New" filter pill shows unread count badge
✅ Quick action links: Call, Email, WhatsApp
✅ Empty state shown when no leads

CONTENT:
✅ /admin/content shows all site_content grouped by page
✅ Tabs: Home, About, Contact
✅ Each content block is editable (text input or textarea)
✅ Save per field works — updates DB + shows toast
✅ Changes reflect on public site (after ISR revalidation)
✅ Section names are humanised

SETTINGS:
✅ /admin/settings shows all site_settings fields
✅ Grouped into Business Details, Contact, Address, Online, Hours
✅ Save updates DB + triggers revalidation
✅ WhatsApp number change reflects in FAB + contact page
✅ Business hours change reflects on contact page
✅ Success toast on save
```
