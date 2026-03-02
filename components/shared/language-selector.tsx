"use client";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, type Locale } from "@/lib/locale";

export function LanguageSelector() {
  const { locale, setLocale } = useLocale();

  function toggle() {
    const next: Locale = locale === "en" ? "af" : "en";
    setLocale(next);
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-9 gap-1.5 px-2 text-white/70 hover:text-white hover:bg-white/10"
      onClick={toggle}
      aria-label={`Switch language to ${locale === "en" ? "Afrikaans" : "English"}`}
    >
      <Globe className="h-4 w-4" />
      <span className="text-xs font-medium uppercase">{locale}</span>
    </Button>
  );
}
