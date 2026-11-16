import { SiteImagesProvider } from "@/components/common/site-images-provider";
import HomePageClient from "@/components/home/home-page-client";
import { getPublicSiteOverrides } from "@/lib/site-images";

export const dynamic = "force-dynamic";

export default async function HomePage() {
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
      <HomePageClient />
    </SiteImagesProvider>
  );
}
