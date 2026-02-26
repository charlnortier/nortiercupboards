"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { upsertFaq, deleteFaq } from "@/lib/cms/actions";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { Save, Plus, Trash2, GripVertical } from "lucide-react";
import type { LocalizedString, HomepageSection, Faq } from "@/types/cms";

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
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [faqSaving, setFaqSaving] = useState(false);

  // Section IDs for upsert
  const [sectionIds, setSectionIds] = useState<Record<string, string>>({});

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [{ data: sections }, { data: faqData }] = await Promise.all([
        supabase
          .from("homepage_sections")
          .select("*")
          .order("display_order"),
        supabase
          .from("faqs")
          .select("*")
          .order("display_order"),
      ]);

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
      setFaqs((faqData as Faq[]) ?? []);
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

  /* ---------- FAQ helpers ---------- */

  function addFaq() {
    setFaqs((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        question: L(),
        answer: L(),
        display_order: prev.length,
        is_active: true,
      },
    ]);
  }

  function updateFaq(index: number, field: "question" | "answer", value: LocalizedString) {
    setFaqs((prev) => prev.map((f, i) => (i === index ? { ...f, [field]: value } : f)));
  }

  function removeFaq(index: number) {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSaveFaqs() {
    setFaqSaving(true);
    try {
      // Fetch current FAQs from DB to determine deletions
      const supabase = createClient();
      const { data: existing } = await supabase.from("faqs").select("id");
      const existingIds = new Set((existing ?? []).map((r: { id: string }) => r.id));
      const currentIds = new Set(faqs.filter((f) => !f.id.startsWith("new-")).map((f) => f.id));

      // Delete removed FAQs
      for (const id of existingIds) {
        if (!currentIds.has(id)) {
          await deleteFaq(id);
        }
      }

      // Upsert all current FAQs
      for (let i = 0; i < faqs.length; i++) {
        const faq = faqs[i];
        await upsertFaq({
          ...(faq.id.startsWith("new-") ? {} : { id: faq.id }),
          question: faq.question,
          answer: faq.answer,
          display_order: i,
          is_active: true,
        });
      }

      // Reload FAQs to get proper IDs
      const { data: refreshed } = await supabase
        .from("faqs")
        .select("*")
        .order("display_order");
      setFaqs((refreshed as Faq[]) ?? []);
      toast.success("FAQs saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
    setFaqSaving(false);
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
            Edit hero, services, about snippet, stats, CTA, and FAQ.
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
            <div key={i} className="flex items-start gap-3 rounded-lg border p-4">
              <GripVertical className="mt-2 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="flex-1 space-y-3">
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field
                    label="Icon (emoji)"
                    value={stat.icon}
                    onChange={(v) =>
                      setTrustStats((prev) =>
                        prev.map((s, j) => (j === i ? { ...s, icon: v } : s))
                      )
                    }
                    placeholder="🏠"
                  />
                  <Field
                    label="Value"
                    value={stat.value}
                    onChange={(v) =>
                      setTrustStats((prev) =>
                        prev.map((s, j) => (j === i ? { ...s, value: v } : s))
                      )
                    }
                    placeholder="20+"
                  />
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <LocalizedInput
                        label="Label"
                        value={stat.label}
                        onChange={(v) =>
                          setTrustStats((prev) =>
                            prev.map((s, j) => (j === i ? { ...s, label: v } : s))
                          )
                        }
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
                onClick={() => setTrustStats((prev) => prev.filter((_, j) => j !== i))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
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
            <div key={i} className="flex items-start gap-3 rounded-lg border p-4">
              <GripVertical className="mt-2 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="flex-1 space-y-3">
                <Field
                  label="Icon (emoji)"
                  value={item.icon}
                  onChange={(v) =>
                    setServices((prev) => ({
                      ...prev,
                      items: prev.items.map((s, j) =>
                        j === i ? { ...s, icon: v } : s
                      ),
                    }))
                  }
                  placeholder="🔨"
                />
                <LocalizedInput
                  label="Title"
                  value={item.title}
                  onChange={(v) =>
                    setServices((prev) => ({
                      ...prev,
                      items: prev.items.map((s, j) =>
                        j === i ? { ...s, title: v } : s
                      ),
                    }))
                  }
                  placeholder="Kitchen Cupboards"
                />
                <LocalizedInput
                  label="Description"
                  value={item.description}
                  onChange={(v) =>
                    setServices((prev) => ({
                      ...prev,
                      items: prev.items.map((s, j) =>
                        j === i ? { ...s, description: v } : s
                      ),
                    }))
                  }
                  placeholder="Custom-designed kitchen cabinetry..."
                  multiline
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="mt-2 shrink-0 text-destructive"
                onClick={() =>
                  setServices((prev) => ({
                    ...prev,
                    items: prev.items.filter((_, j) => j !== i),
                  }))
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
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

      {/* FAQ Management */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">FAQ Management</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage frequently asked questions displayed on the /faq page.
            </p>
          </div>
          <Button onClick={handleSaveFaqs} disabled={faqSaving}>
            <Save className="mr-2 h-4 w-4" />
            {faqSaving ? "Saving..." : "Save FAQs"}
          </Button>
        </div>

        <div className="mt-4 space-y-3">
          {faqs.length === 0 && (
            <p className="text-sm text-muted-foreground">No FAQs yet. Add one below.</p>
          )}
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.id} value={faq.id} className="rounded-lg border px-4">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <AccordionTrigger className="flex-1 text-left text-sm">
                    {faq.question.en || `FAQ #${i + 1}`}
                  </AccordionTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFaq(i);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <AccordionContent className="space-y-3 pb-4">
                  <LocalizedInput
                    label="Question"
                    value={faq.question}
                    onChange={(v) => updateFaq(i, "question", v)}
                    placeholder="How long does installation take?"
                  />
                  <LocalizedInput
                    label="Answer"
                    value={faq.answer}
                    onChange={(v) => updateFaq(i, "answer", v)}
                    placeholder="Installation typically takes..."
                    multiline
                    rows={3}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Button variant="outline" size="sm" onClick={addFaq}>
            <Plus className="mr-2 h-4 w-4" /> Add FAQ
          </Button>
        </div>
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
