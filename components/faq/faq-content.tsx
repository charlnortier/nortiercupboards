"use client";

import { useLocale } from "@/lib/locale";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Faq } from "@/types/cms";

interface FaqContentProps {
  readonly faqs: Faq[];
}

export function FaqContent({ faqs }: FaqContentProps) {
  const { t } = useLocale();

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 md:px-8">
      <h1 className="text-3xl font-bold">{t({ en: "Frequently Asked Questions", af: "Gereelde Vrae" })}</h1>
      <p className="mt-2 text-muted-foreground">
        {t({ en: "Find answers to common questions below.", af: "Vind antwoorde op algemene vrae hieronder." })}
      </p>

      {faqs.length > 0 ? (
        <Accordion type="single" collapsible className="mt-8">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-left">
                {t(faq.question)}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {t(faq.answer)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p className="mt-8 text-muted-foreground">
          {t({ en: "No FAQs have been added yet. Check back soon!", af: "Geen gereelde vrae is nog bygevoeg nie. Kyk gou weer!" })}
        </p>
      )}
    </section>
  );
}
