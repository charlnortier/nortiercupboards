# Build 11 — Admin: Projects CRUD + Image Upload

> **Type:** Admin / CRUD / Storage  
> **Estimated Time:** 60–90 min  
> **Dependencies:** Build 10 (admin layout + auth)  
> **Context Files:** TECHNICAL_DESIGN.md §5.2 + §5.3

---

## Objective

Build the full projects management — list, create, edit, delete, and image upload with before/after tagging and drag-to-reorder. This is the most complex admin build because it combines CRUD, Supabase Storage uploads, and image management.

---

## Tasks

### 1. Projects List Page

**`src/app/(admin)/admin/projects/page.tsx`** — Server component:

```typescript
import { createClient } from '@/lib/supabase/server'
import { ProjectsTable } from '@/components/admin/projects-table'

export default async function AdminProjectsPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select(`
      *,
      project_images ( id, image_url, image_type, sort_order )
    `)
    .order('sort_order')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link href="/admin/projects/new">
          <Button><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
        </Link>
      </div>
      <ProjectsTable projects={projects ?? []} />
    </div>
  )
}
```

**`src/components/admin/projects-table.tsx`** — Client component:

Design:
- Table or card grid showing all projects
- Each row/card:
  - **Thumbnail:** first image (small, 60×60 rounded), or coloured placeholder
  - **Title:** bold, clickable → `/admin/projects/{id}`
  - **Room type:** badge pill (Kitchen, Bedroom, etc.)
  - **Location:** `text-gray-500 text-sm`
  - **Image count:** "4 images" or "No images" (warning yellow if 0)
  - **Featured toggle:** switch component — toggles `is_featured` instantly via server action
  - **Status:** active/inactive toggle (or just show active ones)
  - **Actions:** Edit button → `/admin/projects/{id}`, Delete button (with confirmation dialog)
- Sort: by `sort_order` (drag handle for manual reorder, or just up/down arrows)
- Empty state: "No projects yet. Add your first project to get started."

### 2. Create Project Page

**`src/app/(admin)/admin/projects/new/page.tsx`** — Client component:

Design:
- **Form card** (`bg-white rounded-xl p-8 shadow-sm`):
  - **Title** — text input, required
  - **Slug** — auto-generated from title (kebab-case), editable, with preview: `nortiercupboards.co.za/gallery/modern-kitchen`
  - **Room type** — select: Kitchen, Bedroom, Bathroom, Study, Other
  - **Description** — textarea, optional, 4 rows
  - **Location** — text input, optional (e.g. "Stellenbosch")
  - **Featured** — checkbox: "Show on homepage"
- **Save button:** "Create Project" — on save, redirect to edit page for image upload
- Auto-slug generation:
```typescript
const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
```

Server action or API:
```typescript
const { data, error } = await supabase
  .from('projects')
  .insert({
    title,
    slug,
    room_type: roomType,
    description,
    location,
    is_featured: featured,
    sort_order: nextSortOrder,
  })
  .select('id')
  .single()

// Redirect to edit page for image upload
redirect(`/admin/projects/${data.id}`)
```

### 3. Edit Project Page

**`src/app/(admin)/admin/projects/[id]/page.tsx`**:

Two sections:
1. **Project details form** (same fields as create, pre-filled)
2. **Image manager** (below the form)

Layout:
```
┌────────────────────────────────────────┐
│  ← Back to Projects    Delete Project  │
├────────────────────────────────────────┤
│  PROJECT DETAILS                       │
│  Title: [Modern Kitchen Renovation  ]  │
│  Slug:  [modern-kitchen-renovation  ]  │
│  Type:  [Kitchen ▼]                    │
│  Description: [textarea             ]  │
│  Location: [Stellenbosch            ]  │
│  ☑ Featured on homepage               │
│  [Save Changes]                        │
├────────────────────────────────────────┤
│  IMAGES                                │
│  [+ Upload Images]                     │
│                                        │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │ img1 │ │ img2 │ │ img3 │ │ img4 │  │
│  │AFTER │ │BEFORE│ │AFTER │ │AFTER │  │
│  │ ≡  🗑│ │ ≡  🗑│ │ ≡  🗑│ │ ≡  🗑│  │
│  └──────┘ └──────┘ └──────┘ └──────┘  │
└────────────────────────────────────────┘
```

### 4. Image Upload Component

**`src/components/admin/image-uploader.tsx`** — Client component:

```typescript
'use client'

interface ImageUploaderProps {
  projectId: string
  onUploadComplete: () => void  // refresh image list
}
```

Features:
- Drag-and-drop zone OR click to select files
- Multi-file select
- Accepted types: JPEG, PNG, WebP
- Max file size: 5MB per image
- **Client-side resize** before upload (max 2000px width, maintain aspect ratio):
```typescript
async function resizeImage(file: File, maxWidth = 2000): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new window.Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const scale = Math.min(1, maxWidth / img.width)
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(blob => resolve(blob!), 'image/webp', 0.85)
    }
    img.src = URL.createObjectURL(file)
  })
}
```

Upload flow per file:
```typescript
// 1. Resize
const resized = await resizeImage(file)

// 2. Generate unique filename
const filename = `${crypto.randomUUID()}.webp`
const path = `projects/${projectId}/${filename}`

// 3. Upload to Supabase Storage
const { error: uploadError } = await supabase.storage
  .from('project-images')
  .upload(path, resized, { contentType: 'image/webp' })

// 4. Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('project-images')
  .getPublicUrl(path)

// 5. Insert into project_images table
await supabase.from('project_images').insert({
  project_id: projectId,
  image_url: publicUrl,
  image_type: 'after',  // default
  sort_order: nextOrder,
})
```

Upload UI:
- Drop zone: dashed border, `bg-gray-50`, drag hover state (`bg-brand-gold/10 border-brand-gold`)
- Progress bar per file during upload
- Thumbnail preview after upload completes
- Error handling: file too large, wrong format, upload failure

### 5. Image Grid Manager

**`src/components/admin/image-grid.tsx`** — Client component:

```typescript
'use client'

interface ImageGridProps {
  images: ProjectImage[]
  projectId: string
  onUpdate: () => void
}
```

Features:
- Grid of uploaded images (4 columns desktop, 2 mobile)
- Each image card:
  - **Thumbnail:** 150×150 `object-cover rounded-lg`
  - **Type badge:**
    - `after` → green badge "After"
    - `before` → amber badge "Before"
    - Click badge to cycle: after → before → after
  - **Drag handle:** `≡` icon for reorder (update `sort_order`)
  - **Delete button:** red trash icon, confirmation dialog before delete
    - Delete from `project_images` table AND from Supabase Storage

Type toggle:
```typescript
const toggleType = async (imageId: string, currentType: string) => {
  const newType = currentType === 'after' ? 'before' : 'after'
  await supabase
    .from('project_images')
    .update({ image_type: newType })
    .eq('id', imageId)
  onUpdate()
}
```

Delete:
```typescript
const deleteImage = async (image: ProjectImage) => {
  // Extract storage path from public URL
  const path = image.image_url.split('/project-images/')[1]
  
  // Delete from storage
  await supabase.storage.from('project-images').remove([path])
  
  // Delete from DB
  await supabase.from('project_images').delete().eq('id', image.id)
  
  onUpdate()
}
```

Reorder (simple up/down buttons instead of full drag-and-drop to keep build lean):
```typescript
const moveImage = async (imageId: string, direction: 'up' | 'down') => {
  // Swap sort_order with adjacent image
  // Refresh list
}
```

### 6. Delete Project

Confirmation dialog (shadcn AlertDialog):
- "Delete this project? This will remove the project and all its images permanently."
- "Cancel" + "Delete" (red) buttons
- On delete:
  1. Delete all images from Supabase Storage (loop through `project_images`)
  2. Delete project row (CASCADE deletes `project_images` rows)
  3. Redirect to `/admin/projects`

### 7. Featured Toggle

On the projects list page, the featured toggle should be instant:
```typescript
const toggleFeatured = async (projectId: string, current: boolean) => {
  await supabase
    .from('projects')
    .update({ is_featured: !current })
    .eq('id', projectId)
  router.refresh()
}
```

Use shadcn `<Switch />` component with optimistic update.

---

## Acceptance Criteria

```
✅ /admin/projects shows all projects in a table/grid
✅ Each project shows thumbnail, title, room type, image count
✅ Featured toggle works instantly (switch component)
✅ "Add Project" button navigates to /admin/projects/new
✅ Create form: title, slug (auto-generated), room type, description, location, featured
✅ Slug auto-generates from title, is editable
✅ On create: redirects to edit page for image upload
✅ Edit page shows project form + image manager
✅ Image upload: drag-and-drop or click, multi-file
✅ Images resized client-side to max 2000px before upload
✅ Images uploaded to Supabase Storage as WebP
✅ Uploaded images appear in grid immediately
✅ Image type toggle works (before ↔ after)
✅ Image delete works (removes from storage + DB, with confirmation)
✅ Image reorder works (up/down buttons)
✅ Project delete works with confirmation dialog
✅ Delete removes all images from storage
✅ Empty states for no projects and no images
✅ Error handling: file too large, wrong format, upload failure
```
