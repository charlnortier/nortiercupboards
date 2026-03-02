"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/lib/locale";
import type { LocalizedString } from "@/types/cms";

interface ServiceDetailItem {
  icon?: string;
  image?: string;
  title: LocalizedString;
  description: LocalizedString;
  features?: string[];
}

interface ServicesContentProps {
  readonly heading: LocalizedString;
  readonly intro: LocalizedString;
  readonly services: ServiceDetailItem[];
}

export function ServicesContent({ heading, intro, services }: ServicesContentProps) {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-16 md:px-8">
      {/* Page Heading */}
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          {t(heading)}
        </h1>
        {t(intro) && (
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {t(intro)}
          </p>
        )}
      </section>

      {/* Service Sections */}
      {services.length > 0 ? (
        <div className="mt-16 space-y-12">
          {services.map((service, i) => {
            const isEven = i % 2 === 1;
            const serviceKey = t(service.title) || `service-${i}`;

            return (
              <div
                key={serviceKey}
                className={`flex flex-col gap-8 md:flex-row md:items-center md:gap-12 ${
                  isEven ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Image tile */}
                <div className="group relative aspect-[4/3] shrink-0 overflow-hidden rounded-2xl md:w-[45%]">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={t(service.title) || ""}
                      fill
                      sizes="(max-width: 768px) 100vw, 45vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#1B2A4A]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1D36]/80 via-[#0F1D36]/30 to-[#C4A265]/10" />
                  {service.icon && (
                    <span className="absolute bottom-4 right-4 text-3xl drop-shadow-md">
                      {service.icon}
                    </span>
                  )}
                </div>

                {/* Content Side */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">
                    {t(service.title) || t({ en: "Service", af: "Diens" })}
                  </h2>
                  {t(service.description) && (
                    <div className="mt-3 space-y-3 leading-relaxed text-muted-foreground">
                      {t(service.description)
                        .split("\n\n")
                        .map((paragraph, pi) => (
                          <p key={`${serviceKey}-p-${pi}`}>{paragraph}</p>
                        ))}
                    </div>
                  )}

                  {/* Feature Pills */}
                  {service.features && service.features.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {service.features.map((feature) => (
                        <span
                          key={feature}
                          className="inline-block rounded-full border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Per-service CTA */}
                  <Link
                    href="/contact"
                    className="mt-5 inline-block rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    {t({ en: "Get a Quote", af: "Kry 'n Kwotasie" })}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-12 text-center text-muted-foreground">
          {t({ en: "Services will be listed here soon.", af: "Dienste sal binnekort hier gelys word." })}
        </p>
      )}

      {/* Bottom CTA */}
      <section className="mt-16 rounded-xl bg-primary px-6 py-12 text-center text-primary-foreground">
        <h2 className="text-2xl font-bold">
          {t({ en: "Need something custom?", af: "Iets pasgemaak nodig?" })}
        </h2>
        <p className="mx-auto mt-3 max-w-md opacity-90">
          {t({ en: "Every home is different. Tell us what you need and we'll make it happen.", af: "Elke huis is anders. Vertel ons wat jy nodig het en ons sal dit laat gebeur." })}
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-primary transition-opacity hover:opacity-90"
        >
          {t({ en: "Contact Us", af: "Kontak Ons" })}
        </Link>
      </section>
    </div>
  );
}
