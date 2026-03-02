"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale";
import { Button } from "@/components/ui/button";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import type { PortfolioItem } from "@/types";

interface GalleryPageContentProps {
  readonly items: PortfolioItem[];
}

export function GalleryPageContent({ items }: GalleryPageContentProps) {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-16 md:px-8">
      <h1 className="text-3xl font-bold text-foreground md:text-4xl">
        {t({ en: "Gallery", af: "Galery" })}
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">
        {t({ en: "A selection of our completed projects.", af: "'n Seleksie van ons voltooide projekte." })}
      </p>

      <GalleryGrid items={items} />

      <div className="mt-16 rounded-xl border bg-card p-8 text-center">
        <p className="text-xl font-semibold text-foreground">
          {t({ en: "Like what you see? Let's design yours.", af: "Hou jy van wat jy sien? Laat ons joune ontwerp." })}
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link href="/contact">
            {t({ en: "Get in Touch", af: "Kontak Ons" })}
          </Link>
        </Button>
      </div>
    </div>
  );
}
