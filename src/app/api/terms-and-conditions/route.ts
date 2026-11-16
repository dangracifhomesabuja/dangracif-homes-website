import { NextResponse } from "next/server";
import { getDatabaseConnection } from "@/lib/db/data-source";
import { SiteConfig } from "@/lib/db/entities/SiteConfig";
import { createPdfDownloadUrl } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dataSource = await getDatabaseConnection();
    const config = await dataSource
      .getRepository<SiteConfig>("site_config")
      .findOne({ where: { key: "terms_conditions_url" } });

    if (!config?.value) {
      return NextResponse.json(
        { error: "No uploaded offer terms document has been configured." },
        { status: 404 }
      );
    }

    const downloadUrl = createPdfDownloadUrl(
      config.value,
      "offer terms and conditions document"
    );
    return NextResponse.redirect(downloadUrl);
  } catch (error) {
    console.error("Could not create offer terms download:", error);
    return NextResponse.json(
      { error: "The offer terms document could not be downloaded. Please try again later." },
      { status: 503 }
    );
  }
}
