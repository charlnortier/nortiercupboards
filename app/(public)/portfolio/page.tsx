import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getPublishedPortfolioItems } from "@/lib/cms/queries";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { Button } from "@/components/ui/button";

export async function generateMetadata() {
  return generatePageMetadata("gallery");
}

export default async function GalleryPage() {
  const items = await getPublishedPortfolioItems();

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-16 md:px-8">
      <h1 className="text-3xl font-bold text-foreground md:text-4xl">
        Gallery
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">
        A selection of our completed projects.
      </p>

      <GalleryGrid items={items} />

      <div className="mt-16 rounded-xl border bg-card p-8 text-center">
        <p className="text-xl font-semibold text-foreground">
          Like what you see? Let&apos;s design yours.
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link href="/contact">Get in Touch</Link>
        </Button>
      </div>
    </div>
  );
}
