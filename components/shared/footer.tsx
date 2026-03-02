"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/locale";
import { subscribeNewsletter } from "@/lib/newsletter/actions";
import { isEnabled } from "@/config/features";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import type { FooterSection, SiteSettings } from "@/types/cms";

interface FooterProps {
  readonly sections: FooterSection[];
  readonly settings: SiteSettings;
}

export function Footer({ sections, settings }: FooterProps) {
  const { t } = useLocale();

  return (
    <footer className="bg-[#0F1D36] text-white/60">
      <div className="mx-auto max-w-[1280px] px-4 pb-0 pt-[72px] md:px-8">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-[#C4A265]">
                <span className="font-heading text-xs font-bold tracking-wide text-[#C4A265]">N</span>
                <div className="mx-px h-[18px] w-px bg-[#C4A265]/50" />
                <span className="font-heading text-xs font-bold tracking-wide text-[#C4A265]">C</span>
              </div>
              <div>
                <span className="block text-[13px] font-bold uppercase tracking-[0.08em] text-white">
                  Nortier
                </span>
                <span className="block text-[9px] font-medium uppercase tracking-[0.18em] text-white/50">
                  Cupboards
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/40">
              {t(settings.company_tagline)}
            </p>
          </div>

          {/* Dynamic sections */}
          {sections.map((section) => (
            <div key={section.id}>
              <h4 className="mb-5 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#C4A265]">
                {t(section.title)}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, i) => (
                  <li key={`${link.href}-${i}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 transition-colors hover:text-white"
                    >
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter — only if feature enabled */}
        {isEnabled("newsletter") && (
          <div className="mt-12 border-t border-white/6 pt-8">
            <NewsletterForm />
          </div>
        )}

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/6 py-6 md:flex-row">
          <span className="text-[13px] text-white/30">
            &copy; {new Date().getFullYear()} {settings.company_name}.{" "}
            {t({ en: "All rights reserved.", af: "Alle regte voorbehou." })}
          </span>
          <span className="text-[13px] text-white/30">
            {t({ en: "Powered by", af: "Aangedryf deur" })}{" "}
            <a href="https://yoros.co.za" className="text-[#C4A265]/60 transition-opacity hover:opacity-100">
              Yoros
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

function NewsletterForm() {
  const { t } = useLocale();
  const [state, formAction, isPending] = useActionState(
    subscribeNewsletter,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success(
        t({
          en: "You're subscribed! We'll keep you in the loop.",
          af: "Jy is ingeteken! Ons sal jou op hoogte hou.",
        })
      );
      formRef.current?.reset();
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state, t]);

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h3 className="text-sm font-semibold text-white/80">
        {t({
          en: "Stay in the loop",
          af: "Bly op hoogte",
        })}
      </h3>
      <p className="max-w-md text-sm text-white/40">
        {t({
          en: "Get tips, updates, and offers — straight to your inbox.",
          af: "Kry wenke, opdaterings en aanbiedinge — reguit na jou inkassie.",
        })}
      </p>
      <form
        ref={formRef}
        action={formAction}
        className="flex w-full max-w-sm gap-2"
      >
        <input
          type="email"
          name="email"
          required
          placeholder={t({
            en: "your@email.com",
            af: "jou@epos.com",
          })}
          className="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#C4A265]/30"
        />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-md bg-[#C4A265] px-4 py-2 text-sm font-medium text-[#1B2A4A] transition-colors hover:bg-[#D4B87A] disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
          {t({ en: "Subscribe", af: "Teken in" })}
        </button>
      </form>
    </div>
  );
}
