import "reflect-metadata";
import { DataSource } from "typeorm";
import { User, UserSchema } from "./entities/User";
import { PropertyUnit, PropertyUnitSchema } from "./entities/PropertyUnit";
import { LeadInquiry, LeadInquirySchema } from "./entities/LeadInquiry";
import { BlogPost, BlogPostSchema } from "./entities/BlogPost";
import { FaqItem, FaqItemSchema } from "./entities/FaqItem";
import { ConstructionMilestone, ConstructionMilestoneSchema } from "./entities/ConstructionMilestone";
import { SiteConfig, SiteConfigSchema } from "./entities/SiteConfig";
import { MediaAsset, MediaAssetSchema } from "./entities/MediaAsset";
import { InitialSchema1710000000000 } from "./migrations/1710000000000-InitialSchema";
import { ContentSchema1729000000000 } from "./migrations/1729000000000-ContentSchema";
import { SeedProjectsAndCareers1730000000000 } from "./migrations/1730000000000-SeedProjectsAndCareers";
import { UpdateOtherProjectContent1731000000000 } from "./migrations/1731000000000-UpdateOtherProjectContent";
import { UpdatePropertyUnitPrices1732000000000 } from "./migrations/1732000000000-UpdatePropertyUnitPrices";
import { SetPropertyUnitsAvailable1733000000000 } from "./migrations/1733000000000-SetPropertyUnitsAvailable";
import { RemoveSeededSampleInquiries1734000000000 } from "./migrations/1734000000000-RemoveSeededSampleInquiries";
import { AddBlogPostSortOrder1735000000000 } from "./migrations/1735000000000-AddBlogPostSortOrder";

// Load environment variables for CLI usage
if (typeof process !== "undefined" && process.env) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require("fs");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("path");
    const envLocal = path.resolve(process.cwd(), ".env.local");
    const envFile = path.resolve(process.cwd(), ".env");
    const targetFile = fs.existsSync(envLocal) ? envLocal : fs.existsSync(envFile) ? envFile : null;
    if (targetFile) {
      const content = fs.readFileSync(targetFile, "utf-8");
      content.split("\n").forEach((line: string) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      });
    }
  } catch {
    // ignore
  }
}

const connectionUrl =
  process.env.DATABASE_URL ||
  "postgresql://hellosauri@localhost:5432/dangracif_homes";

const useSsl =
  connectionUrl.includes("sslmode=require") ||
  connectionUrl.includes("supabase.co") ||
  connectionUrl.includes("neon.tech");

const isProduction = process.env.NODE_ENV === "production";

const globalForDataSource = globalThis as unknown as {
  _appDataSource?: DataSource;
};

export const AppDataSource: DataSource =
  (isProduction ? undefined : globalForDataSource._appDataSource) ??
  new DataSource({
    type: "postgres",
    url: connectionUrl,
    schema: "public",
    ssl: useSsl ? { rejectUnauthorized: false } : false,
    synchronize: false, // strictly use migrations
    logging: process.env.NODE_ENV === "development",
    entities: [
      UserSchema,
      PropertyUnitSchema,
      LeadInquirySchema,
      BlogPostSchema,
      FaqItemSchema,
      ConstructionMilestoneSchema,
      SiteConfigSchema,
      MediaAssetSchema,
    ],
    migrations: [
      InitialSchema1710000000000,
      ContentSchema1729000000000,
      SeedProjectsAndCareers1730000000000,
      UpdateOtherProjectContent1731000000000,
      UpdatePropertyUnitPrices1732000000000,
      SetPropertyUnitsAvailable1733000000000,
      RemoveSeededSampleInquiries1734000000000,
      AddBlogPostSortOrder1735000000000,
    ],
    subscribers: [],
  });

if (!isProduction) {
  globalForDataSource._appDataSource = AppDataSource;
}

let initializationPromise: Promise<DataSource> | undefined;

export async function getDatabaseConnection(): Promise<DataSource> {
  if (initializationPromise) return initializationPromise;
  if (AppDataSource.isInitialized) return AppDataSource;

  const initialization = AppDataSource.initialize().then(() => {
    const requiredTables = [
      "users",
      "property_units",
      "lead_inquiries",
      "blog_posts",
      "faq_items",
      "construction_milestones",
      "site_config",
      "media_assets",
    ];
    const missingTables = requiredTables.filter(
      (name) => !AppDataSource.hasMetadata(name)
    );
    if (missingTables.length > 0) {
      throw new Error(
        `Database entity metadata was not registered for tables: ${missingTables.join(", ")}. ` +
          `Registered tables: ${AppDataSource.entityMetadatas
            .map(({ tableName }) => tableName)
            .join(", ")}.`
      );
    }
    return AppDataSource;
  });
  initializationPromise = initialization;
  try {
    return await initialization;
  } catch (error) {
    initializationPromise = undefined;
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
    throw error;
  }
}

// Re-export entities for convenience
export {
  User, UserSchema,
  PropertyUnit, PropertyUnitSchema,
  LeadInquiry, LeadInquirySchema,
  BlogPost, BlogPostSchema,
  FaqItem, FaqItemSchema,
  ConstructionMilestone, ConstructionMilestoneSchema,
  SiteConfig, SiteConfigSchema,
  MediaAsset, MediaAssetSchema,
};
