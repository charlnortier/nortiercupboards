"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PortfolioItem } from "@/types";
import { Lightbox } from "@/components/gallery/lightbox";
import { useLocale } from "@/lib/locale";

/** Map of industry values to display labels for filter pills. */
const ROOM_LABELS: Record<string, { en: string; af: string }> = {
  Kitchen: { en: "Kitchens", af: "Kombuise" },
  Bedroom: { en: "Bedrooms", af: "Slaapkamers" },
  Bathroom: { en: "Bathrooms", af: "Badkamers" },
  Study: { en: "Studies", af: "Studeerkamers" },
  Other: { en: "Other", af: "Ander" },
};

interface GalleryGridProps {
  items: PortfolioItem[];
}

/** Returns true when the item has a hero (after) image and at least one additional (before) image. */
function hasBeforeAfter(item: PortfolioItem): boolean {
  return !!(item.hero_image_url && item.images && item.images.length > 0);
}

export function GalleryGrid({ items }: GalleryGridProps) {
  const { t } = useLocale();
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [lightbox, setLightbox] = useState<{
    images: string[];
    alt: string;
    index: number;
    beforeImage?: string;
  } | null>(null);

  // Derive unique room types present in data, preserving a stable order.
  const roomTypes = useMemo(() => {
    const ordered = ["Kitchen", "Bedroom", "Bathroom", "Study", "Other"];
    const present = new Set(items.map((i) => i.industry).filter(Boolean));
    return ordered.filter((r) => present.has(r));
  }, [items]);

  const filters = ["All", ...roomTypes];

  const filtered = useMemo(() => {
    if (activeFilter === "All") return items;
    return items.filter((i) => i.industry === activeFilter);
  }, [items, activeFilter]);

  function openLightbox(item: PortfolioItem) {
    // Build image list: hero first, then any additional images.
    const imgs: string[] = [];
    if (item.hero_image_url) imgs.push(item.hero_image_url);
    for (const url of item.images ?? []) {
      if (!imgs.includes(url)) imgs.push(url);
    }
    if (imgs.length === 0) return;

    const ba = hasBeforeAfter(item);
    setLightbox({
      images: imgs,
      alt: t(item.alt_text) || t(item.title),
      index: 0,
      beforeImage: ba ? item.images[0] : undefined,
    });
  }

  return (
    <>
      {/* ---- Filter pills ---- */}
      <div className="mt-8 flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = filter === activeFilter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {filter === "All"
                ? t({ en: "All", af: "Alles" })
                : t(ROOM_LABELS[filter]) || filter}
            </button>
          );
        })}
      </div>

      {/* ---- Grid ---- */}
      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-muted-foreground">
          {t({ en: "No projects found for this category. Check back soon!", af: "Geen projekte gevind vir hierdie kategorie nie. Kyk weer later!" })}
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              {/* Image area */}
              <button
                type="button"
                onClick={() => openLightbox(item)}
                className="group relative aspect-[4/3] cursor-pointer overflow-hidden bg-muted"
              >
                {item.hero_image_url ? (
                  <Image
                    src={item.hero_image_url}
                    alt={t(item.alt_text) || t(item.title)}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-3xl font-bold text-muted-foreground/30">
                    {t(item.title).charAt(0)}
                  </span>
                )}

                {/* Industry badge */}
                {item.industry && (
                  <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-2 py-1 text-xs text-primary-foreground">
                    {t(ROOM_LABELS[item.industry]) || item.industry}
                  </span>
                )}

                {/* Before & After badge */}
                {hasBeforeAfter(item) && (
                  <span className="absolute right-3 top-3 rounded-full bg-secondary/90 px-2 py-1 text-xs font-medium text-secondary-foreground">
                    {t({ en: "Before & After", af: "Voor & Na" })}
                  </span>
                )}
              </button>

              {/* Details */}
              <Link href={`/portfolio/${item.slug}`} className="block p-4 transition-colors hover:bg-muted/50">
                <h2 className="font-semibold text-foreground">
                  {t(item.title)}
                </h2>
                {t(item.description) && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {t(item.description)}
                  </p>
                )}
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* ---- Lightbox ---- */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          alt={lightbox.alt}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
          beforeImage={lightbox.beforeImage}
        />
      )}
    </>
  );
}
