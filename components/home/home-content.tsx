"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/lib/locale";
import type { LocalizedString, SiteSettings } from "@/types/cms";
import type { PortfolioItem } from "@/types";

/* ---------- Section content types ---------- */

interface HeroContent {
  heading?: LocalizedString;
  subheading?: LocalizedString;
  cta_text?: LocalizedString;
  cta_url?: string;
  cta_secondary_text?: LocalizedString;
  cta_secondary_url?: string;
  background_image?: string;
}

interface TrustStatsContent {
  items?: { icon?: string; value?: string; label?: LocalizedString }[];
}

interface ServicesContent {
  heading?: LocalizedString;
  subheading?: LocalizedString;
  items?: {
    icon?: string;
    image?: string;
    title?: LocalizedString;
    description?: LocalizedString;
  }[];
}

interface AboutContent {
  heading?: LocalizedString;
  body?: LocalizedString;
  image?: string;
}

interface CtaContent {
  heading?: LocalizedString;
  body?: LocalizedString;
  button_text?: LocalizedString;
  button_url?: string;
}

export interface HomeContentProps {
  readonly hero?: HeroContent;
  readonly trustStats?: TrustStatsContent;
  readonly services?: ServicesContent;
  readonly about?: AboutContent;
  readonly cta?: CtaContent;
  readonly trustStripValues: string[];
  readonly featuredProjects: PortfolioItem[];
  readonly settings: SiteSettings;
}

export function HomeContent({
  hero,
  trustStats,
  services,
  about,
  cta,
  trustStripValues,
  featuredProjects,
  settings,
}: HomeContentProps) {
  const { t } = useLocale();

  return (
    <>
      {/* ───── 1. Hero ───── */}
      {hero && (
        <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#0F1D36] md:min-h-[85vh]">
          {hero.background_image ? (
            <Image
              src={hero.background_image}
              alt=""
              fill
              priority
              className="object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-[#1B2A4A]/80" />

          <div className="relative z-10 mx-auto max-w-3xl px-4 py-20 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t(hero.heading) || "Welcome"}
            </h1>
            {t(hero.subheading) && (
              <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
                {t(hero.subheading)}
              </p>
            )}

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {t(hero.cta_text) && hero.cta_url && (
                <Link
                  href={hero.cta_url}
                  className="inline-flex items-center gap-2 rounded-[10px] bg-[#C4A265] px-8 py-3.5 text-sm font-semibold text-[#1B2A4A] transition-all hover:bg-[#D4B87A] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(196,162,101,0.3)]"
                >
                  {t(hero.cta_text)}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              )}
              {t(hero.cta_secondary_text) && hero.cta_secondary_url && (
                <Link
                  href={hero.cta_secondary_url}
                  className="inline-block rounded-[10px] border-[1.5px] border-white/25 px-8 py-3.5 text-sm font-medium text-white transition-all hover:border-white/50 hover:bg-white/5"
                >
                  {t(hero.cta_secondary_text)}
                </Link>
              )}
            </div>

            {settings.whatsapp_number && (
              <p className="mt-7 flex items-center justify-center gap-2 text-sm text-white/40">
                <span>{t({ en: "or", af: "of" })}</span>
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replaceAll(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#25D366] transition-colors hover:text-[#4AE37D]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                  {t({ en: "WhatsApp us now", af: "WhatsApp ons nou" })}
                </a>
              </p>
            )}
          </div>
        </section>
      )}

      {/* ───── 2. Trust Stats Strip ───── */}
      {trustStats?.items && trustStats.items.length > 0 && (
        <section className="border-t border-[#C4A265]/15 bg-[#1B2A4A] text-white">
          <div className="mx-auto grid max-w-[1280px] grid-cols-2 md:grid-cols-4">
            {trustStats.items.map((stat, i) => (
              <div key={t(stat.label) || stat.value} className="relative px-6 py-8 text-center">
                {i < trustStats.items!.length - 1 && (
                  <div className="absolute right-0 top-1/2 hidden h-12 w-px -translate-y-1/2 bg-[#C4A265]/15 md:block" />
                )}
                {stat.icon && (
                  <span className="mb-2 block text-xl">{stat.icon}</span>
                )}
                {stat.value && (
                  <span className="block font-heading text-3xl font-extrabold text-[#C4A265]">
                    {stat.value}
                  </span>
                )}
                {t(stat.label) && (
                  <span className="mt-1 block text-[13px] font-medium text-white/50">
                    {t(stat.label)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ───── 3. Services Grid ───── */}
      {services?.items && services.items.length > 0 && (
        <section className="bg-[#FAF7F2] py-24 dark:bg-background">
          <div className="mx-auto max-w-[1280px] px-4 md:px-8">
            {t(services.heading) && (
              <>
                <p className="text-center text-xs font-semibold uppercase tracking-[0.1em] text-[#C4A265]">
                  {t({ en: "Services", af: "Dienste" })}
                </p>
                <h2 className="mt-3 text-center text-3xl font-extrabold tracking-tight">
                  {t(services.heading)}
                </h2>
              </>
            )}
            {t(services.subheading) && (
              <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
                {t(services.subheading)}
              </p>
            )}
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.items.map((item, i) => (
                <div
                  key={t(item.title) || i}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
                >
                  {/* Background image */}
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={t(item.title) || ""}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#1B2A4A]" />
                  )}

                  {/* Colour overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1D36]/90 via-[#0F1D36]/50 to-[#C4A265]/10 transition-opacity group-hover:from-[#0F1D36]/95 group-hover:via-[#0F1D36]/60" />

                  {/* Content */}
                  <div className="relative flex h-full flex-col justify-end p-6">
                    {item.icon && (
                      <span className="mb-2 text-2xl drop-shadow-md">{item.icon}</span>
                    )}
                    {t(item.title) && (
                      <h3 className="text-lg font-bold text-white">{t(item.title)}</h3>
                    )}
                    {t(item.description) && (
                      <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                        {t(item.description)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───── 4. Featured Projects ───── */}
      {featuredProjects.length > 0 && (
        <section className="py-24">
          <div className="mx-auto max-w-[1280px] px-4 md:px-8">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.1em] text-[#C4A265]">
              {t({ en: "Portfolio", af: "Portefeulje" })}
            </p>
            <h2 className="mt-3 text-center text-3xl font-extrabold tracking-tight">
              {t({ en: "Our Recent Work", af: "Ons Onlangse Werk" })}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
              {t({ en: "A selection of our recent projects", af: "'n Seleksie van ons onlangse projekte" })}
            </p>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/portfolio/${project.slug}`}
                  className="group overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(15,29,54,0.12)]"
                >
                  {project.hero_image_url ? (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={project.hero_image_url}
                        alt={t(project.title)}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : null}
                  <div className="p-5">
                    <h3 className="font-bold">
                      {t(project.title) || t({ en: "Untitled", af: "Ongetiteld" })}
                    </h3>
                    {project.industry && (
                      <span className="mt-1.5 inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                        {project.industry}
                      </span>
                    )}
                    <span className="mt-3 block text-sm font-semibold text-[#C4A265]">
                      {t({ en: "View Project", af: "Bekyk Projek" })} &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───── 5. About Snippet ───── */}
      {t(about?.heading) && (
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-4 text-center md:px-8">
            <h2 className="text-3xl font-extrabold tracking-tight">{t(about?.heading)}</h2>
            {t(about?.body) && (
              <p className="mt-4 text-lg text-muted-foreground">
                {t(about?.body)}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ───── 6. Trust Strip ───── */}
      {trustStripValues.length > 0 && (
        <section className="bg-[#E8ECF3] py-5 dark:bg-muted">
          <div className="mx-auto max-w-[1280px] px-4 text-center md:px-8">
            <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-[#5C6B7A]">
              {trustStripValues.join(" \u00B7 ")}
            </p>
          </div>
        </section>
      )}

      {/* ───── 7. CTA Banner ───── */}
      {t(cta?.heading) && (
        <section className="relative overflow-hidden bg-[#C4A265]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(255,255,255,0.08)_0%,transparent_50%),radial-gradient(ellipse_at_80%_50%,rgba(168,137,63,0.15)_0%,transparent_40%)] pointer-events-none" />
          <div className="relative mx-auto max-w-[720px] px-8 py-20 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#0F1D36]">
              {t(cta?.heading)}
            </h2>
            {t(cta?.body) && (
              <p className="mx-auto mt-4 max-w-[500px] text-base text-[#0F1D36]/70">
                {t(cta?.body)}
              </p>
            )}
            {t(cta?.button_text) && cta?.button_url && (
              <Link
                href={cta.button_url}
                className="mt-8 inline-flex items-center gap-2 rounded-[10px] bg-[#1B2A4A] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#0F1D36] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,29,54,0.25)]"
              >
                {t(cta?.button_text)}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            )}
          </div>
        </section>
      )}
    </>
  );
}
