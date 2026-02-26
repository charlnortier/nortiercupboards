# Build 01 — Project Scaffold & Supabase

> **Type:** Setup  
> **Estimated Time:** 30–45 min  
> **Dependencies:** None  
> **Context Files:** YOROS_UNIVERSAL_PROJECT_BRIEF.md, TECHNICAL_DESIGN.md

---

## Objective

Bootstrap a Next.js 14+ project with the Nortier Cupboards brand identity, Supabase integration, shadcn/ui components, and folder structure ready for all subsequent builds. This is the simplest Yoros template deployment — a 5-page brochure site with gallery and lead capture.

---

## Tasks

### 1. Create Next.js Project

```bash
npx create-next-app@latest nortier-cupboards --typescript --tailwind --app --src-dir --import-alias "@/*"
cd nortier-cupboards
```

### 2. Install Dependencies

```bash
# Supabase
pnpm add @supabase/supabase-js @supabase/ssr

# UI
pnpm add class-variance-authority clsx tailwind-merge lucide-react sonner

# shadcn/ui init
pnpm dlx shadcn@latest init

# Email
pnpm add resend @react-email/components

# Utils
pnpm add zod
```

### 3. shadcn/ui Components

```bash
pnpm dlx shadcn@latest add button input card dialog select textarea toast label badge separator sheet scroll-area skeleton tooltip
```

### 4. Folder Structure

```
src/
├── app/
│   ├── (public)/              # Public-facing pages
│   │   ├── layout.tsx         # Public layout (nav + footer + WhatsApp FAB)
│   │   ├── page.tsx           # Homepage
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── services/
│   │   │   └── page.tsx
│   │   ├── gallery/
│   │   │   └── page.tsx
│   │   └── contact/
│   │       └── page.tsx
│   ├── (admin)/
│   │   ├── admin/
│   │   │   ├── layout.tsx     # Admin layout (sidebar)
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── projects/
│   │   │   ├── leads/
│   │   │   ├── content/
│   │   │   └── settings/
│   │   └── login/
│   │       └── page.tsx
│   ├── api/
│   │   └── contact/
│   │       └── route.ts
│   ├── layout.tsx             # Root layout
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── not-found.tsx
│   └── error.tsx
├── components/
│   ├── ui/                    # shadcn/ui (auto-generated)
│   ├── layout/                # Nav, Footer, MobileMenu, WhatsAppFab
│   ├── gallery/               # ProjectGrid, ProjectCard, Lightbox, BeforeAfter
│   ├── admin/                 # Admin-specific components
│   └── shared/                # Hero, CtaBanner, TrustStats, etc.
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser client
│   │   ├── server.ts          # Server client
│   │   └── admin.ts           # Service role client (API routes)
│   ├── data/                  # Data fetching helpers
│   │   ├── settings.ts
│   │   ├── content.ts
│   │   ├── services.ts
│   │   ├── projects.ts
│   │   ├── nav.ts
│   │   └── stats.ts
│   ├── email/                 # React Email templates
│   └── utils.ts
├── types/
│   ├── database.ts            # Supabase generated types
│   └── index.ts
├── hooks/
└── config/
    └── site.ts
```

### 5. Supabase Client Setup

**`src/lib/supabase/client.ts`** — Browser client:
```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**`src/lib/supabase/server.ts`** — Server client:
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch { /* Server Component — ignore */ }
        },
      },
    }
  )
}
```

**`src/lib/supabase/admin.ts`** — Service role client (for API routes):
```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

### 6. Middleware

**`src/middleware.ts`**:
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    // Check admin role via user metadata
    const role = user.user_metadata?.role
    if (role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```

### 7. Tailwind Config — Nortier Brand Tokens

> **Source of truth:** `design/BRAND_DESIGN_SYSTEM.md` §10

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // Navy palette
          navy: '#1B2A4A',
          'navy-dark': '#0F1D36',
          'navy-light': '#2A3F6B',
          'navy-pale': '#E8ECF3',
          // Accent
          camel: '#C4A265',
          'camel-dark': '#A8893F',
          // Backgrounds
          parchment: '#FAF7F2',
          sandstone: '#E2DAD0',
          // Text
          slate: '#5C6B7A',
          // Functional
          success: '#3D7A4A',
          error: '#C44B3A',
          whatsapp: '#25D366',
        },
      },
      fontFamily: {
        display: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

### 8. Font Setup

**`src/app/layout.tsx`**:
```typescript
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: {
    template: '%s | Nortier Cupboards',
    default: 'Nortier Cupboards | Custom Cupboards in Paarl, Western Cape',
  },
  description: 'Custom kitchen, bedroom, bathroom & study cupboards. 20+ years experience. Design, manufacture & installation in Paarl and the Cape Winelands.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable}`}>
      <body className="font-body bg-brand-parchment text-brand-navy-dark antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
```

### 9. Utility Functions

**`src/lib/utils.ts`**:
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 10. Site Config

**`src/config/site.ts`**:
```typescript
export const siteConfig = {
  name: 'Nortier Cupboards',
  tagline: 'Quality, experience and professional service',
  description: 'Custom kitchen, bedroom, bathroom & study cupboards. 20+ years experience. Design, manufacture & installation in Paarl and the Cape Winelands.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://nortiercupboards.co.za',
  ogImage: '/og.png',
  locale: 'en-ZA',
} as const
```

### 11. Environment Variables

**`.env.example`**:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend (email)
RESEND_API_KEY=

# Analytics
NEXT_PUBLIC_GA_ID=

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 12. Placeholder Pages

Create minimal placeholders so route structure is in place:

- `src/app/(public)/page.tsx` → "Nortier Cupboards — Coming Soon"
- `src/app/(public)/about/page.tsx` → "About — Coming Soon"
- `src/app/(public)/services/page.tsx` → "Services — Coming Soon"
- `src/app/(public)/gallery/page.tsx` → "Gallery — Coming Soon"
- `src/app/(public)/contact/page.tsx` → "Contact — Coming Soon"
- `src/app/(admin)/admin/page.tsx` → "Admin Dashboard" placeholder
- `src/app/(admin)/login/page.tsx` → "Login" placeholder

---

## Supabase Setup

### Create Supabase Project
1. Create project `nortier-cupboards` in Supabase dashboard
2. Copy URL + anon key + service role key to `.env.local`
3. Run Migration 001 (core tables) — see `migrations/001_core_tables.sql`
4. Run Migration 002 (RLS policies) — see `migrations/002_rls_policies.sql`
5. Run Migration 003 (seed data) — see `migrations/003_seed_data.sql`
6. Create admin user via Supabase Auth dashboard (Charl's email, set `role: admin` in user metadata)

### Create Storage Buckets
1. `project-images` — public bucket, 5MB max, allowed: image/jpeg, image/png, image/webp
2. `site-assets` — public bucket, 5MB max, allowed: image/jpeg, image/png, image/webp, image/svg+xml

---

## Acceptance Criteria

```
✅ `pnpm run build` passes with zero errors
✅ `pnpm run dev` starts without errors
✅ Brand fonts load (Plus Jakarta Sans headings, Inter body)
✅ Brand colours available as Tailwind classes (bg-brand-navy, text-brand-camel, etc.)
✅ Supabase client initialises without errors
✅ All 7 placeholder pages render at their URLs
✅ Middleware redirects /admin to /login when unauthenticated
✅ All folder paths exist as specified
✅ shadcn/ui components installed and importable
✅ .env.example documents all required environment variables
```
