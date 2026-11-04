import { NextResponse } from "next/server";
import { getDatabaseConnection } from "@/lib/db/data-source";
import { SiteConfig } from "@/lib/db/entities/SiteConfig";
import { createBrochureDownloadUrl } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dataSource = await getDatabaseConnection();
    const config = await dataSource
      .getRepository<SiteConfig>("SiteConfig")
      .findOne({ where: { key: "brochure_url" } });

    if (!config?.value) {
      return NextResponse.json(
        { error: "No brochure has been configured." },
        { status: 404 }
      );
    }

    const downloadUrl = createBrochureDownloadUrl(config.value);
    return NextResponse.redirect(downloadUrl);
  } catch (error) {
    console.error("Could not create brochure download:", error);
    return NextResponse.json(
      { error: "The brochure could not be downloaded. Please try again later." },
      { status: 503 }
    );
  }
}
