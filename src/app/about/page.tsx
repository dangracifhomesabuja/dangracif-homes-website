import { SiteImagesProvider } from "@/components/common/site-images-provider";
import AboutPageClient from "@/components/about/about-page-client";
import { getPublicSiteOverrides } from "@/lib/site-images";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const { images, imageCaptions, brochureUrl, termsConditionsUrl, youtubeUrl } =
    await getPublicSiteOverrides();

  return (
    <SiteImagesProvider
      overrides={images}
      imageCaptions={imageCaptions}
      brochureUrl={brochureUrl}
      termsConditionsUrl={termsConditionsUrl}
      youtubeUrl={youtubeUrl}
    >
      <AboutPageClient />
    </SiteImagesProvider>
  );
}
