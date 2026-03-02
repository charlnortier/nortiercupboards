"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale";
import type { LocalizedString } from "@/types/cms";

interface ProcessStep {
  step: string;
  title: LocalizedString;
  description: LocalizedString;
}

interface ValueItem {
  title: LocalizedString;
  description: LocalizedString;
}

interface AboutContentData {
  heading?: LocalizedString;
  body?: LocalizedString;
  mission?: LocalizedString;
  process?: ProcessStep[];
  values?: ValueItem[];
  service_area?: LocalizedString;
}

interface AboutContentProps {
  readonly content: AboutContentData | null;
}

export function AboutContent({ content }: AboutContentProps) {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-16 md:px-8">
      {/* Hero Heading */}
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          {t(content?.heading) || t({ en: "About Nortier Cupboards", af: "Oor Nortier Cupboards" })}
        </h1>
        {t(content?.mission) && (
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {t(content?.mission)}
          </p>
        )}
      </section>

      {/* Story Section */}
      {t(content?.body) && (
        <section className="mx-auto mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold">{t({ en: "Our Story", af: "Ons Storie" })}</h2>
          <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
            {t(content?.body).split("\n\n").map((paragraph) => (
              <p key={paragraph.substring(0, 20)}>{paragraph}</p>
            ))}
          </div>
        </section>
      )}

      {/* Process Section */}
      {content?.process && content.process.length > 0 && (
        <section className="mt-20">
          <h2 className="text-center text-2xl font-bold">{t({ en: "How We Work", af: "Hoe Ons Werk" })}</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
            {t({ en: "From first visit to final installation — here's what to expect.", af: "Van eerste besoek tot finale installering — hier is wat om te verwag." })}
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {content.process.map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  {t(item.title)}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(item.description)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Why Choose Us Section */}
      {content?.values && content.values.length > 0 && (
        <section className="mt-20">
          <h2 className="text-center text-2xl font-bold">{t({ en: "Why Choose Us", af: "Hoekom Ons Kies" })}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {content.values.map((value) => (
              <div
                key={t(value.title)}
                className="rounded-xl border bg-card p-6"
              >
                <h3 className="font-semibold">{t(value.title)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(value.description)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Service Area */}
      {t(content?.service_area) && (
        <section className="mt-20 text-center">
          <h2 className="text-2xl font-bold">{t({ en: "Service Area", af: "Diensgebied" })}</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {t(content?.service_area)}
          </p>
        </section>
      )}

      {/* CTA */}
      <section className="mt-20 rounded-xl bg-primary px-6 py-12 text-center text-primary-foreground">
        <h2 className="text-2xl font-bold">
          {t({ en: "Ready to discuss your project?", af: "Gereed om jou projek te bespreek?" })}
        </h2>
        <p className="mx-auto mt-3 max-w-md opacity-90">
          {t({ en: "Get in touch for a free, no-obligation consultation and quote.", af: "Kontak ons vir 'n gratis, vryblywende konsultasie en kwotasie." })}
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
