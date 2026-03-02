import { generatePageMetadata } from "@/lib/seo/metadata";
import { getSiteContent, getHomepageSections } from "@/lib/cms/queries";
import { ServicesContent } from "@/components/services/services-content";
import type { LocalizedString } from "@/types/cms";

export async function generateMetadata() {
  return generatePageMetadata("services");
}

interface ServiceDetailItem {
  icon?: string;
  image?: string;
  title: LocalizedString;
  description: LocalizedString;
  features?: string[];
}

interface ServiceDetailContent {
  heading?: LocalizedString;
  intro?: LocalizedString;
  items?: ServiceDetailItem[];
}

interface HomepageServiceItem {
  icon?: string;
  image?: string;
  title: LocalizedString;
  description: LocalizedString;
}

export default async function ServicesPage() {
  const detailContent = (await getSiteContent("services_detail")) as ServiceDetailContent | null;

  let heading: LocalizedString = { en: "Our Services", af: "Ons Dienste" };
  let intro: LocalizedString = { en: "", af: "" };
  let services: ServiceDetailItem[] = [];

  if (detailContent?.items && detailContent.items.length > 0) {
    heading = detailContent.heading ?? heading;
    intro = detailContent.intro ?? intro;
    services = detailContent.items;
  } else {
    const sections = await getHomepageSections();
    const servicesSection = sections.find((s) => s.section_key === "services");

    if (servicesSection) {
      const content = servicesSection.content as {
        heading?: LocalizedString;
        subheading?: LocalizedString;
        items?: HomepageServiceItem[];
      };
      heading = content.heading ?? heading;
      intro = content.subheading ?? intro;
      services = (content.items ?? []).map((item) => ({
        icon: item.icon,
        image: item.image,
        title: item.title,
        description: item.description,
      }));
    }
  }

  return <ServicesContent heading={heading} intro={intro} services={services} />;
}
