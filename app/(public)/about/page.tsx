import { generatePageMetadata } from "@/lib/seo/metadata";
import { getSiteContent } from "@/lib/cms/queries";
import { AboutContent } from "@/components/about/about-content";

export async function generateMetadata() {
  return generatePageMetadata("about");
}

export default async function AboutPage() {
  const content = await getSiteContent("about");

  return <AboutContent content={content as any} />;
}
