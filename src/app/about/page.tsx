import { SiteImagesProvider } from "@/components/common/site-images-provider";
import AboutPageClient from "@/components/about/about-page-client";
import { getPublicSiteOverrides } from "@/lib/site-images";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const { images, imageCaptions, brochureUrl, youtubeUrl } =
    await getPublicSiteOverrides();

  return (
    <SiteImagesProvider
      overrides={images}
      imageCaptions={imageCaptions}
      brochureUrl={brochureUrl}
      youtubeUrl={youtubeUrl}
    >
      <AboutPageClient />
    </SiteImagesProvider>
  );
}
