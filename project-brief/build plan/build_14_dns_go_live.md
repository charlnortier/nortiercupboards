# Build 14 — DNS Migration + Go Live

> **Type:** DevOps / Launch  
> **Estimated Time:** 30–45 min  
> **Dependencies:** All previous builds (01–13)  
> **Context Files:** TECHNICAL_DESIGN.md §10

---

## Objective

Ship it. Deploy to Vercel, migrate DNS, verify everything works on production, set up analytics and monitoring. Hand the keys to Charl.

---

## Tasks

### 1. Vercel Deployment

- [ ] Push final code to GitHub `main` branch
- [ ] Connect repo to Vercel (if not already)
- [ ] Add environment variables in Vercel dashboard:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `RESEND_API_KEY`
  - `NEXT_PUBLIC_GA_ID`
  - `NEXT_PUBLIC_SITE_URL=https://nortiercupboards.co.za`
- [ ] Trigger deploy
- [ ] Verify build succeeds with no errors
- [ ] Test on Vercel preview URL (`.vercel.app`) before DNS switch

### 2. Pre-Launch Production Checklist

Test on the Vercel preview URL:

**Public pages:**
- [ ] Homepage loads — all 6 sections render, images/placeholders show
- [ ] About page — story, process steps, trust signals render
- [ ] Services page — all 6 services with features and CTAs
- [ ] Gallery page — filter works, lightbox opens, before/after slider (if images exist)
- [ ] Contact page — form submits successfully
- [ ] Contact form → row appears in Supabase `contact_submissions`
- [ ] Contact form → email notification received (check Resend logs)

**WhatsApp:**
- [ ] FAB button visible on all pages
- [ ] Click opens correct `wa.me` URL with pre-filled message
- [ ] Number matches what's in `site_settings`

**Admin:**
- [ ] `/login` page loads
- [ ] Can log in with Charl's credentials
- [ ] Dashboard shows correct stats
- [ ] Can create a project + upload images
- [ ] Can view leads
- [ ] Can edit content → changes appear on public site
- [ ] Can update settings
- [ ] Sign out works

**Mobile:**
- [ ] Test on real phone (or device emulator)
- [ ] Nav hamburger works
- [ ] Gallery swipe works
- [ ] Lightbox touch works
- [ ] Contact form usable
- [ ] WhatsApp FAB positioned correctly

### 3. DNS Migration

**Current state:** nortiercupboards.co.za → broken WordPress host

**Required DNS changes at domain registrar:**
```
Type    Name    Value                       TTL
A       @       76.76.21.21                 300
CNAME   www     cname.vercel-dns.com        300
```

Steps:
1. Add custom domain in Vercel project settings: `nortiercupboards.co.za` + `www.nortiercupboards.co.za`
2. Log in to domain registrar (client needs to provide access or make changes)
3. Remove old A records / CNAME records pointing to WordPress host
4. Add new records as above
5. Wait for propagation (usually 5–30 min, up to 48h)
6. Verify in Vercel: domain shows "Valid configuration"
7. SSL certificate auto-provisions via Vercel (Let's Encrypt)

**Fallback:** If DNS access isn't available immediately, the site is live on the `.vercel.app` URL. DNS can be migrated later without any code changes.

### 4. Post-DNS Verification

Once domain is live:
- [ ] `https://nortiercupboards.co.za` loads (not http)
- [ ] `https://www.nortiercupboards.co.za` redirects to non-www (or vice versa)
- [ ] SSL certificate is active (padlock in browser)
- [ ] All pages load on the live domain
- [ ] Contact form works on production domain
- [ ] Email notifications come from correct sender domain
- [ ] WhatsApp links work
- [ ] OG tags show correct canonical URLs (not `.vercel.app`)

### 5. Google Search Console

- [ ] Add property: `https://nortiercupboards.co.za`
- [ ] Verify ownership (DNS TXT record or HTML file)
- [ ] Submit sitemap: `https://nortiercupboards.co.za/sitemap.xml`
- [ ] Request indexing for homepage
- [ ] Check for crawl errors

### 6. Google Analytics 4

- [ ] Create GA4 property for nortiercupboards.co.za
- [ ] Get Measurement ID (`G-XXXXXXXXXX`)
- [ ] Add to Vercel env: `NEXT_PUBLIC_GA_ID`
- [ ] Add GA script to root layout:
```typescript
// src/app/layout.tsx
import Script from 'next/script'

{process.env.NEXT_PUBLIC_GA_ID && (
  <>
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      strategy="afterInteractive"
    />
    <Script id="ga4" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
      `}
    </Script>
  </>
)}
```
- [ ] Verify: real-time reports show visits

### 7. Client Handoff

**Train Charl on admin panel** (quick call or screen recording):
- How to log in (`/login`)
- How to add a new project (create → upload images → tag before/after)
- How to view and manage leads (statuses, notes)
- How to edit site text (content editor)
- How to update phone/email/WhatsApp (settings)
- Remind: add real photos as projects complete — the gallery is only as good as the photos

**Provide to client:**
- Admin login URL: `https://nortiercupboards.co.za/login`
- Admin credentials (email + password)
- Support contact (your email/WhatsApp for issues)
- Brief doc or video walkthrough of admin panel

### 8. Content TODO for Client

Flag items that need real content (currently placeholders):
- [ ] Hero background image — needs a high-quality wide-angle kitchen photo
- [ ] Project photos — need real before/after pairs (minimum 5–10 projects)
- [ ] Owner/team photo for About page
- [ ] Workshop photos
- [ ] Exact address for Google Maps embed
- [ ] Confirmed WhatsApp number
- [ ] Confirmed email address
- [ ] Logo file (currently text-only — design later or use the 20 Years badge)

---

## 🚀 Launch Checklist

```
PRE-LAUNCH:
✅ All pages render correctly on Vercel preview URL
✅ Contact form saves to DB + sends email
✅ Admin login + all admin features work
✅ Mobile responsive on real device
✅ No console errors
✅ Lighthouse scores > 90 across all categories

DNS:
✅ Domain added in Vercel
✅ DNS records updated at registrar
✅ SSL certificate active
✅ www redirect works

POST-LAUNCH:
✅ Site loads on nortiercupboards.co.za
✅ Google Search Console verified + sitemap submitted
✅ GA4 tracking active
✅ Client trained on admin panel
✅ Content TODO list shared with client

🚀 LIVE
```
