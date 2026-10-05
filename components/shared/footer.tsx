"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale";
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
