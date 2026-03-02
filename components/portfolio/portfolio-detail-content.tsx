"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/locale";
import type { PortfolioItem } from "@/types";

interface PortfolioDetailContentProps {
  readonly item: PortfolioItem;
}

export function PortfolioDetailContent({ item }: PortfolioDetailContentProps) {
  const { t } = useLocale();

  return (
    <article className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      {/* Back link */}
      <Link
        href="/portfolio"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t({ en: "Back to Portfolio", af: "Terug na Portefeulje" })}
      </Link>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">
          {t(item.title)}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {item.industry && (
            <Badge variant="secondary">{item.industry}</Badge>
          )}
          {item.live_url && (
            <a
              href={item.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {t({ en: "Visit live site", af: "Besoek lewendige werf" })}
            </a>
          )}
        </div>
      </header>

      {/* Hero image */}
      {item.hero_image_url && (
        <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-xl bg-muted">
          <Image
            src={item.hero_image_url}
            alt={t(item.alt_text) || t(item.title)}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Description */}
      {t(item.description) && (
        <div className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">
            {t({ en: "About this project", af: "Oor hierdie projek" })}
          </h2>
          <div className="space-y-3 text-muted-foreground">
            {t(item.description).split("\n\n").map((p) => (
              <p key={p.substring(0, 30)}>{p}</p>
            ))}
          </div>
        </div>
      )}

      {/* Features / highlights */}
      {item.features && item.features.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">
            {t({ en: "Key Features", af: "Sleutelkenmerke" })}
          </h2>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
            {item.features.map((f) => (
              <li key={t(f)}>{t(f)}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Tech stack */}
      {item.tech_stack && item.tech_stack.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">
            {t({ en: "Tech Stack", af: "Tegnologie Stapel" })}
          </h2>
          <div className="flex flex-wrap gap-2">
            {item.tech_stack.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Image gallery */}
      {item.images && item.images.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">
            {t({ en: "Gallery", af: "Galery" })}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {item.images.map((img) => (
              <div
                key={img}
                className="relative aspect-[16/10] overflow-hidden rounded-lg bg-muted"
              >
                <Image
                  src={img}
                  alt={`${t(item.title)} ${t({ en: "gallery image", af: "galery beeld" })}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 rounded-xl border bg-muted/30 p-8 text-center">
        <h2 className="text-xl font-semibold">
          {t({ en: "Interested in similar work?", af: "Belangstel in soortgelyke werk?" })}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {t({ en: "Get in touch and let's discuss your project.", af: "Kontak ons en laat ons jou projek bespreek." })}
        </p>
        <Button asChild className="mt-4">
          <Link href="/contact">{t({ en: "Contact Us", af: "Kontak Ons" })}</Link>
        </Button>
      </div>
    </article>
  );
}
