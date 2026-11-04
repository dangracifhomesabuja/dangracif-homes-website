import "reflect-metadata";
import { getDatabaseConnection } from "@/lib/db/data-source";
import { SiteConfig } from "@/lib/db/entities/SiteConfig";

export async function getPublicSiteOverrides(): Promise<{
  images: Record<string, string>;
  brochureUrl: string;
  youtubeUrl: string;
}> {
  try {
    const dataSource = await getDatabaseConnection();
    const overrides: Record<string, string> = {};
    const configs = await dataSource
      .getRepository<SiteConfig>("site_config")
      .find({
        where: [
          { key: "site_images" },
          { key: "brochure_url" },
          { key: "estate" },
        ],
      });

    let brochureUrl = "";
    let youtubeUrl = "";
    for (const config of configs) {
      if (config.key === "brochure_url") {
        if (config.value.startsWith("https://res.cloudinary.com/")) {
          brochureUrl = config.value;
        }
        continue;
      }

      const parsed: unknown = JSON.parse(config.value);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        continue;
      }
      if (config.key === "estate") {
        const configuredUrl = (parsed as Record<string, unknown>).youtubeUrl;
        if (typeof configuredUrl === "string") {
          youtubeUrl = configuredUrl;
        }
        continue;
      }
      for (const [key, value] of Object.entries(parsed)) {
        if (typeof value === "string") overrides[key] = value;
      }
    }
    return { images: overrides, brochureUrl, youtubeUrl };
  } catch (error) {
    console.warn("Could not load site image overrides:", error);
    return { images: {}, brochureUrl: "", youtubeUrl: "" };
  }
}
