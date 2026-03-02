"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LocalizedInput } from "@/components/admin/localized-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Plus, Trash2, GripVertical } from "lucide-react";
import type { LocalizedString, HomepageSection } from "@/types/cms";

const L = (en = "", af = ""): LocalizedString => ({ en, af });

/* ---------- Hero ---------- */

interface HeroContent {
  heading: LocalizedString;
  subheading: LocalizedString;
  cta_text: LocalizedString;
  cta_url: string;
  cta_secondary_text: LocalizedString;
  cta_secondary_url: string;
  background_image: string;
}

const defaultHero: HeroContent = {
  heading: L(),
  subheading: L(),
  cta_text: L(),
  cta_url: "",
  cta_secondary_text: L(),
  cta_secondary_url: "",
  background_image: "",
};

/* ---------- Trust Stats ---------- */

interface TrustStat {
  icon: string;
  value: string;
  label: LocalizedString;
}

/* ---------- Service Item ---------- */

interface ServiceItem {
  icon: string;
  title: LocalizedString;
  description: LocalizedString;
}

interface ServicesContent {
  heading: LocalizedString;
  subheading: LocalizedString;
  items: ServiceItem[];
}

const defaultServices: ServicesContent = {
  heading: L(),
  subheading: L(),
  items: [],
};

/* ---------- About ---------- */

interface AboutContent {
  heading: LocalizedString;
  body: LocalizedString;
  image: string;
}

const defaultAbout: AboutContent = {
  heading: L(),
  body: L(),
  image: "",
};

/* ---------- CTA ---------- */

interface CtaContent {
  heading: LocalizedString;
  body: LocalizedString;
  button_text: LocalizedString;
  button_url: string;
}

const defaultCta: CtaContent = {
  heading: L(),
  body: L(),
  button_text: L(),
  button_url: "",
};

/* ---------- Page ---------- */

export default function AdminHomepagePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [hero, setHero] = useState<HeroContent>(defaultHero);
  const [trustStats, setTrustStats] = useState<TrustStat[]>([]);
  const [services, setServices] = useState<ServicesContent>(defaultServices);
  const [about, setAbout] = useState<AboutContent>(defaultAbout);
  const [cta, setCta] = useState<CtaContent>(defaultCta);
  // Section IDs for upsert
  const [sectionIds, setSectionIds] = useState<Record<string, string>>({});

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: sections } = await supabase
        .from("homepage_sections")
        .select("*")
        .order("display_order");

      const sMap: Record<string, HomepageSection> = {};
      const idMap: Record<string, string> = {};
      for (const s of (sections ?? []) as HomepageSection[]) {
        sMap[s.section_key] = s;
        idMap[s.section_key] = s.id;
      }

      if (sMap.hero) setHero({ ...defaultHero, ...(sMap.hero.content as Partial<HeroContent>) });
      if (sMap.trust_stats) {
        const items = (sMap.trust_stats.content as { items?: TrustStat[] })?.items;
        if (items) setTrustStats(items);
      }
      if (sMap.services) setServices({ ...defaultServices, ...(sMap.services.content as Partial<ServicesContent>) });
      if (sMap.about) setAbout({ ...defaultAbout, ...(sMap.about.content as Partial<AboutContent>) });
      if (sMap.cta) setCta({ ...defaultCta, ...(sMap.cta.content as Partial<CtaContent>) });

      setSectionIds(idMap);
      setLoading(false);
    }
    load();
  }, []);

  async function saveSection(key: string, content: Record<string, unknown>, order: number) {
    const supabase = createClient();
    const existing = sectionIds[key];
    if (existing) {
      await supabase
        .from("homepage_sections")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", existing);
    } else {
      const { data } = await supabase
        .from("homepage_sections")
        .upsert(
          { section_key: key, content, display_order: order, is_active: true },
          { onConflict: "section_key" }
        )
        .select("id")
        .single();
      if (data) setSectionIds((prev) => ({ ...prev, [key]: data.id }));
    }
  }

  async function handleSaveAll() {
    setSaving(true);
    try {
      await Promise.all([
        saveSection("hero", hero as unknown as Record<string, unknown>, 0),
        saveSection("trust_stats", { items: trustStats } as unknown as Record<string, unknown>, 1),
        saveSection("services", services as unknown as Record<string, unknown>, 2),
        saveSection("about", about as unknown as Record<string, unknown>, 3),
        saveSection("cta", cta as unknown as Record<string, unknown>, 4),
      ]);
      toast.success("Homepage sections saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground">Homepage Sections</h1>
        <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Homepage Sections</h1>
          <p className="mt-1 text-muted-foreground">
            Edit hero, services, about snippet, stats, and CTA.
          </p>
        </div>
        <Button onClick={handleSaveAll} disabled={saving} size="lg">
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Sections"}
        </Button>
      </div>

      {/* Hero */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>The main banner at the top of the homepage.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LocalizedInput
            label="Heading"
            value={hero.heading}
            onChange={(v) => setHero((p) => ({ ...p, heading: v }))}
            placeholder="Custom Cupboards, Built to Last"
          />
          <LocalizedInput
            label="Subheading"
            value={hero.subheading}
            onChange={(v) => setHero((p) => ({ ...p, subheading: v }))}
            placeholder="20+ years of expert craftsmanship"
            multiline
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <LocalizedInput
              label="Primary CTA Text"
              value={hero.cta_text}
              onChange={(v) => setHero((p) => ({ ...p, cta_text: v }))}
              placeholder="Get a Free Quote"
            />
            <Field
              label="Primary CTA URL"
              value={hero.cta_url}
              onChange={(v) => setHero((p) => ({ ...p, cta_url: v }))}
              placeholder="/contact"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <LocalizedInput
              label="Secondary CTA Text"
              value={hero.cta_secondary_text}
              onChange={(v) => setHero((p) => ({ ...p, cta_secondary_text: v }))}
              placeholder="View Our Work"
            />
            <Field
              label="Secondary CTA URL"
              value={hero.cta_secondary_url}
              onChange={(v) => setHero((p) => ({ ...p, cta_secondary_url: v }))}
              placeholder="/portfolio"
            />
          </div>
          <Field
            label="Background Image URL"
            value={hero.background_image}
            onChange={(v) => setHero((p) => ({ ...p, background_image: v }))}
            placeholder="https://..."
          />
        </CardContent>
      </Card>

      {/* Trust Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Trust Stats Strip</CardTitle>
          <CardDescription>Statistics displayed below the hero (e.g. &quot;20+ Years&quot;, &quot;500+ Projects&quot;).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {trustStats.map((stat, i) => (
            <TrustStatEditor
              key={`stat-${stat.value}-${stat.label.en || i}`}
              stat={stat}
              onUpdate={(updated) =>
                setTrustStats((prev) =>
                  prev.map((s, j) => (j === i ? updated : s))
                )
              }
              onRemove={() =>
                setTrustStats((prev) => prev.filter((_, j) => j !== i))
              }
            />
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setTrustStats((prev) => [...prev, { icon: "", value: "", label: L() }])
            }
          >
            <Plus className="mr-2 h-4 w-4" /> Add Stat
          </Button>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Services Grid</CardTitle>
          <CardDescription>Service cards displayed on the homepage.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LocalizedInput
            label="Section Heading"
            value={services.heading}
            onChange={(v) => setServices((p) => ({ ...p, heading: v }))}
            placeholder="Our Services"
          />
          <LocalizedInput
            label="Section Subheading"
            value={services.subheading}
            onChange={(v) => setServices((p) => ({ ...p, subheading: v }))}
            placeholder="Everything you need for your dream kitchen"
          />

          {services.items.map((item, i) => (
            <ServiceItemEditor
              key={`service-${item.title.en || i}`}
              item={item}
              onUpdate={(updated) =>
                setServices((prev) => ({
                  ...prev,
                  items: prev.items.map((s, j) => (j === i ? updated : s)),
                }))
              }
              onRemove={() =>
                setServices((prev) => ({
                  ...prev,
                  items: prev.items.filter((_, j) => j !== i),
                }))
              }
            />
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setServices((prev) => ({
                ...prev,
                items: [...prev.items, { icon: "", title: L(), description: L() }],
              }))
            }
          >
            <Plus className="mr-2 h-4 w-4" /> Add Service
          </Button>
        </CardContent>
      </Card>

      {/* About Snippet */}
      <Card>
        <CardHeader>
          <CardTitle>About Snippet</CardTitle>
          <CardDescription>Short about section on the homepage.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LocalizedInput
            label="Heading"
            value={about.heading}
            onChange={(v) => setAbout((p) => ({ ...p, heading: v }))}
            placeholder="About Nortier Cupboards"
          />
          <LocalizedInput
            label="Body"
            value={about.body}
            onChange={(v) => setAbout((p) => ({ ...p, body: v }))}
            placeholder="With over 20 years of experience..."
            multiline
            rows={4}
          />
          <Field
            label="Image URL"
            value={about.image}
            onChange={(v) => setAbout((p) => ({ ...p, image: v }))}
            placeholder="https://..."
          />
        </CardContent>
      </Card>

      {/* CTA Banner */}
      <Card>
        <CardHeader>
          <CardTitle>CTA Banner</CardTitle>
          <CardDescription>Call-to-action banner at the bottom of the homepage.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LocalizedInput
            label="Heading"
            value={cta.heading}
            onChange={(v) => setCta((p) => ({ ...p, heading: v }))}
            placeholder="Ready to Transform Your Space?"
          />
          <LocalizedInput
            label="Body"
            value={cta.body}
            onChange={(v) => setCta((p) => ({ ...p, body: v }))}
            placeholder="Get in touch for a free consultation..."
            multiline
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <LocalizedInput
              label="Button Text"
              value={cta.button_text}
              onChange={(v) => setCta((p) => ({ ...p, button_text: v }))}
              placeholder="Contact Us"
            />
            <Field
              label="Button URL"
              value={cta.button_url}
              onChange={(v) => setCta((p) => ({ ...p, button_url: v }))}
              placeholder="/contact"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveAll} disabled={saving} size="lg">
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save All Sections"}
        </Button>
      </div>

    </div>
  );
}

/* ---------- Reusable Field ---------- */

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

/* ---------- Trust Stat Editor ---------- */

function TrustStatEditor({
  stat,
  onUpdate,
  onRemove,
}: {
  stat: TrustStat;
  onUpdate: (updated: TrustStat) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border p-4">
      <GripVertical className="mt-2 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="flex-1 space-y-3">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field
            label="Icon (emoji)"
            value={stat.icon}
            onChange={(v) => onUpdate({ ...stat, icon: v })}
            placeholder="🏠"
          />
          <Field
            label="Value"
            value={stat.value}
            onChange={(v) => onUpdate({ ...stat, value: v })}
            placeholder="20+"
          />
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <LocalizedInput
                label="Label"
                value={stat.label}
                onChange={(v) => onUpdate({ ...stat, label: v })}
                placeholder="Years Experience"
              />
            </div>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="mt-2 shrink-0 text-destructive"
        onClick={onRemove}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

/* ---------- Service Item Editor ---------- */

function ServiceItemEditor({
  item,
  onUpdate,
  onRemove,
}: {
  item: ServiceItem;
  onUpdate: (updated: ServiceItem) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border p-4">
      <GripVertical className="mt-2 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="flex-1 space-y-3">
        <Field
          label="Icon (emoji)"
          value={item.icon}
          onChange={(v) => onUpdate({ ...item, icon: v })}
          placeholder="🔨"
        />
        <LocalizedInput
          label="Title"
          value={item.title}
          onChange={(v) => onUpdate({ ...item, title: v })}
          placeholder="Kitchen Cupboards"
        />
        <LocalizedInput
          label="Description"
          value={item.description}
          onChange={(v) => onUpdate({ ...item, description: v })}
          placeholder="Custom-designed kitchen cabinetry..."
          multiline
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="mt-2 shrink-0 text-destructive"
        onClick={onRemove}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
