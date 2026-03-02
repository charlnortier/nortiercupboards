import { generatePageMetadata } from "@/lib/seo/metadata";
import { getSiteSettings } from "@/lib/cms/queries";
import { localBusinessSchema } from "@/lib/seo/structured-data";
import { ContactContent } from "./contact-content";

export async function generateMetadata() {
  return generatePageMetadata("contact");
}

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema(settings)),
        }}
      />
      <ContactContent settings={settings} />
    </>
  );
}
