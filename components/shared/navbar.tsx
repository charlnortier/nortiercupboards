"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageSelector } from "@/components/shared/language-selector";
import { NavbarAuthButton } from "@/components/shared/navbar-auth-button";
import { useLocale } from "@/lib/locale";
import { CartIcon } from "@/components/shop/cart-icon";
import { siteConfig } from "@/config/site";
import type { NavLink, SiteSettings } from "@/types/cms";

interface NavbarProps {
  readonly links: NavLink[];
  readonly settings: SiteSettings;
}

export function Navbar({ links, settings }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLocale();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#C4A265]/12 bg-[rgba(27,42,74,0.97)] backdrop-blur-2xl">
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-4 md:px-8">
        {/* Logo — monogram + wordmark per mockup */}
        <Link href="/" className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-[#C4A265]">
            <span className="font-heading text-sm font-bold tracking-wide text-[#C4A265]">N</span>
            <div className="mx-px h-[22px] w-px bg-[#C4A265]/50" />
            <span className="font-heading text-sm font-bold tracking-wide text-[#C4A265]">C</span>
          </div>
          <div>
            <span className="block text-[15px] font-bold uppercase tracking-[0.08em] text-white">
              Nortier
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-white/50">
              Cupboards
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              {t(link.label)}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <LanguageSelector />
          <ThemeToggle />
          {siteConfig.features.shop && <CartIcon />}
          <NavbarAuthButton />
          <Link href={settings.cta_url}>
            <button className="rounded-lg bg-[#C4A265] px-5 py-2.5 text-sm font-semibold text-[#1B2A4A] transition-all hover:bg-[#D4B87A] hover:-translate-y-px">
              {t(settings.cta_label)}
            </button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[#C4A265]/10 bg-[#1B2A4A] md:hidden">
          <nav className="flex flex-col px-4 py-4">
            {links.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="rounded-md px-3 py-3 text-base text-white/70 transition-colors hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {t(link.label)}
              </Link>
            ))}
            <div className="mt-4 flex items-center justify-between border-t border-[#C4A265]/10 pt-4">
              <div className="flex items-center gap-1">
                <LanguageSelector />
                <ThemeToggle />
                {siteConfig.features.shop && <CartIcon />}
              </div>
              <div className="flex items-center gap-2">
                <NavbarAuthButton />
                <Link href={settings.cta_url} onClick={() => setMobileOpen(false)}>
                  <button className="rounded-lg bg-[#C4A265] px-4 py-2 text-sm font-semibold text-[#1B2A4A]">
                    {t(settings.cta_label)}
                  </button>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
