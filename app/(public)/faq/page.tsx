import { generatePageMetadata } from "@/lib/seo/metadata";
import { getFaqs } from "@/lib/cms/queries";
import { faqPageSchema } from "@/lib/seo/structured-data";
import { FaqContent } from "@/components/faq/faq-content";

export async function generateMetadata() {
  return generatePageMetadata("faq");
}

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <>
      <FaqContent faqs={faqs} />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqPageSchema(faqs)),
          }}
        />
      )}
    </>
  );
}
