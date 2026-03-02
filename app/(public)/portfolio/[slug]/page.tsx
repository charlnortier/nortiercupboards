import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPortfolioItemBySlug } from "@/lib/cms/queries";
import { siteConfig } from "@/config/site";
import { PortfolioDetailContent } from "@/components/portfolio/portfolio-detail-content";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || `https://${siteConfig.domain}`;

interface PortfolioDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PortfolioDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPortfolioItemBySlug(slug);

  if (!item) return { title: "Project Not Found" };

  return {
    title: item.title.en,
    description:
      item.description?.en ??
      `${item.title.en} — a project by ${siteConfig.name}.`,
    openGraph: {
      title: `${item.title.en} | ${siteConfig.name}`,
      description:
        item.description?.en ?? `${item.title.en} — by ${siteConfig.name}.`,
      url: `/portfolio/${slug}`,
      ...(item.hero_image_url
        ? { images: [{ url: item.hero_image_url }] }
        : {}),
    },
  };
}

export default async function PortfolioDetailPage({
  params,
}: PortfolioDetailProps) {
  const { slug } = await params;
  const item = await getPortfolioItemBySlug(slug);

  if (!item) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Portfolio",
        item: `${BASE_URL}/portfolio`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: item.title.en,
        item: `${BASE_URL}/portfolio/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PortfolioDetailContent item={item} />
    </>
  );
}
