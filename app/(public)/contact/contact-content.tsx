"use client";

import { useLocale } from "@/lib/locale";
import { isEnabled } from "@/config/features";
import { ContactForm } from "./contact-form";
import { WhatsAppLink } from "@/components/shared/whatsapp-link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import type { SiteSettings, DaySchedule } from "@/types/cms";

interface ContactContentProps {
  readonly settings: SiteSettings;
}

export function ContactContent({ settings }: ContactContentProps) {
  const { t } = useLocale();
  const showMap = isEnabled("googleMaps") && !!settings.google_maps_url;

  return (
    <>
      {/* Map banner — full-width strip under navbar */}
      {showMap && (
        <div className="h-[260px] w-full md:h-[320px]">
          <iframe
            src={settings.google_maps_url}
            title={`${settings.company_name || "Our"} location`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}

      <section className="mx-auto max-w-[1280px] px-4 py-16 md:px-8">
        <h1 className="text-3xl font-bold">
          {t({ en: "Contact Us", af: "Kontak Ons" })}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t({ en: "Get in touch — we'd love to hear from you.", af: "Kontak ons — ons hoor graag van jou." })}
        </p>

        <div className="mt-10 grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>

          {/* Business Details */}
          <div className="space-y-8">
            <div className="space-y-4">
              {settings.phone_number && (
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{t({ en: "Phone", af: "Telefoon" })}</p>
                    <a
                      href={`tel:${settings.phone_number}`}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {settings.phone_number}
                    </a>
                  </div>
                </div>
              )}
              {settings.email && (
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{t({ en: "Email", af: "E-pos" })}</p>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>
              )}
              {settings.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{t({ en: "Address", af: "Adres" })}</p>
                    <p className="text-sm text-muted-foreground">
                      {settings.address}
                    </p>
                  </div>
                </div>
              )}
              {settings.business_hours && (
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{t({ en: "Business Hours", af: "Besigheidsure" })}</p>
                    {typeof settings.business_hours === "string" ? (
                      <p className="text-sm text-muted-foreground">
                        {settings.business_hours}
                      </p>
                    ) : (
                      <BusinessHoursTable hours={settings.business_hours} />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* WhatsApp */}
            {isEnabled("whatsapp") && settings.whatsapp_number && (
              <WhatsAppLink phoneNumber={settings.whatsapp_number} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

const DAY_LABELS: Record<string, { en: string; af: string }> = {
  monday: { en: "Mon", af: "Ma" },
  tuesday: { en: "Tue", af: "Di" },
  wednesday: { en: "Wed", af: "Wo" },
  thursday: { en: "Thu", af: "Do" },
  friday: { en: "Fri", af: "Vr" },
  saturday: { en: "Sat", af: "Sa" },
  sunday: { en: "Sun", af: "So" },
};

function BusinessHoursTable({ hours }: { readonly hours: DaySchedule[] }) {
  const { t } = useLocale();

  return (
    <div className="mt-1 space-y-1">
      {hours.map((h) => (
        <div key={h.day} className="flex items-center gap-3 text-sm">
          <span className="w-8 font-medium text-foreground">
            {t(DAY_LABELS[h.day]) || h.day}
          </span>
          {h.open ? (
            <span className="text-muted-foreground">
              {h.from} – {h.to}
            </span>
          ) : (
            <span className="text-muted-foreground/50">
              {t({ en: "Closed", af: "Gesluit" })}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
