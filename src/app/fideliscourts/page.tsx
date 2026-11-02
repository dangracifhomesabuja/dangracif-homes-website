import { SiteImagesProvider } from "@/components/common/site-images-provider";
import FidelisCourtPageClient from "@/components/fidelis-court/fidelis-court-page-client";
import { getPublicSiteOverrides } from "@/lib/site-images";
import { getPublicFacilities } from "@/app/actions/public-content";

export const dynamic = "force-dynamic";

export default async function FidelisCourtPage() {
  const [{ images, brochureUrl, youtubeUrl }, facilities] = await Promise.all([
    getPublicSiteOverrides(),
    getPublicFacilities(),
  ]);

  return (
    <SiteImagesProvider
      overrides={images}
      brochureUrl={brochureUrl}
      youtubeUrl={youtubeUrl}
    >
      <FidelisCourtPageClient facilities={facilities} />
    </SiteImagesProvider>
  );
}
