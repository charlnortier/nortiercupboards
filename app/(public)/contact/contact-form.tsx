"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContactForm } from "@/lib/contact/actions";
import { useLocale } from "@/lib/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function ContactForm() {
  const { t } = useLocale();
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success(t({ en: "Message sent! We'll get back to you soon.", af: "Boodskap gestuur! Ons sal binnekort reageer." }));
      formRef.current?.reset();
    }
  }, [state, t]);

  if (state?.success) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border bg-card p-8 text-center">
        <CheckCircle className="h-12 w-12 text-green-500" />
        <h3 className="text-lg font-semibold">{t({ en: "Message Sent", af: "Boodskap Gestuur" })}</h3>
        <p className="text-sm text-muted-foreground">
          {t({ en: "Thank you for reaching out. We'll get back to you as soon as possible.", af: "Dankie dat jy ons gekontak het. Ons sal so gou moontlik reageer." })}
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      {/* Honeypot — hidden from humans, filled by bots */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">{t({ en: "Name", af: "Naam" })} *</Label>
        <Input
          id="name"
          name="name"
          required
          placeholder={t({ en: "Your full name", af: "Jou volle naam" })}
          disabled={isPending}
          autoComplete="name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t({ en: "Email", af: "E-pos" })} *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          disabled={isPending}
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">{t({ en: "Phone", af: "Telefoon" })}</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+27 12 345 6789"
          disabled={isPending}
          autoComplete="tel"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="service">{t({ en: "Service Interest", af: "Dienste-belangstelling" })}</Label>
        <select
          id="service"
          name="service"
          disabled={isPending}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 font-sans text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">{t({ en: "Select a service (optional)", af: "Kies 'n diens (opsioneel)" })}</option>
          <option value="Kitchen Cupboards">{t({ en: "Kitchen Cupboards", af: "Kombuiskaste" })}</option>
          <option value="Bedroom Cupboards">{t({ en: "Bedroom Cupboards", af: "Slaapkamerkaste" })}</option>
          <option value="Bathroom Vanities">{t({ en: "Bathroom Vanities", af: "Badkamermeubels" })}</option>
          <option value="Study & Office">{t({ en: "Study & Office", af: "Studeerkamer & Kantoor" })}</option>
          <option value="Loose Furniture">{t({ en: "Loose Furniture", af: "Los Meubels" })}</option>
          <option value="Shutters & Blinds">{t({ en: "Shutters & Blinds", af: "Luike & Blindings" })}</option>
          <option value="Other">{t({ en: "Other", af: "Ander" })}</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{t({ en: "Message", af: "Boodskap" })} *</Label>
        <Textarea
          id="message"
          name="message"
          required
          placeholder={t({ en: "How can we help?", af: "Hoe kan ons help?" })}
          rows={5}
          disabled={isPending}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        {t({ en: "By submitting this form you agree to our", af: "Deur hierdie vorm in te dien stem jy in tot ons" })}{" "}
        <a href="/privacy" className="underline hover:text-foreground">
          {t({ en: "Privacy Policy", af: "Privaatheidsbeleid" })}
        </a>{". "}
        {t({ en: "We will never share your information with third parties.", af: "Ons sal nooit jou inligting met derde partye deel nie." })}
      </p>

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t({ en: "Sending...", af: "Stuur..." })}
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            {t({ en: "Send Message", af: "Stuur Boodskap" })}
          </>
        )}
      </Button>
    </form>
  );
}
