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

const isProduction = process.env.NODE_ENV === "production";
const useSsl =
  connectionUrl.includes("sslmode=require") ||
  connectionUrl.includes("supabase.co") ||
  connectionUrl.includes("neon.tech");

// Avoid duplicate connections in Next.js development hot-reloads
const globalForDataSource = globalThis as unknown as {
  _appDataSource?: DataSource;
};

export const AppDataSource: DataSource =
  globalForDataSource._appDataSource ??
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
    ],
    subscribers: [],
  });

if (process.env.NODE_ENV !== "production") {
  globalForDataSource._appDataSource = AppDataSource;
}

export async function getDatabaseConnection(): Promise<DataSource> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
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
