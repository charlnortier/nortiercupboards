import { generatePageMetadata } from "@/lib/seo/metadata";
import { getPublishedPortfolioItems } from "@/lib/cms/queries";
import { GalleryPageContent } from "@/components/gallery/gallery-page-content";

export async function generateMetadata() {
  return generatePageMetadata("gallery");
}

export default async function GalleryPage() {
  const items = await getPublishedPortfolioItems();

  return <GalleryPageContent items={items} />;
}
