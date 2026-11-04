"use server";

import "reflect-metadata";
import { getDatabaseConnection } from "@/lib/db/data-source";
import { BlogPost } from "@/lib/db/entities/BlogPost";
import { FaqItem } from "@/lib/db/entities/FaqItem";
import { ConstructionMilestone } from "@/lib/db/entities/ConstructionMilestone";
import { PropertyUnit } from "@/lib/db/entities/PropertyUnit";
import { SiteConfig } from "@/lib/db/entities/SiteConfig";
import { BLOG_POSTS } from "@/constants/blog";
import {
  DEFAULT_FACILITIES,
  type Facility,
  normalizeFacilities,
} from "@/constants/facilities";
import {
  normalizeOtherProjects,
  type OtherProject,
} from "@/constants/other-projects";
import {
  normalizeCareerOpenings,
  type CareerOpening,
} from "@/constants/careers";

const DEFAULT_MILESTONES = [
  { phase: "Phase 1", date: "Apr 2026", title: "Groundbreaking & site mobilisation" },
  { phase: "Phase 2", date: "Oct 2026 – Jun 2027", title: "Substructure & superstructure works" },
  { phase: "Phase 3", date: "Jul – Nov 2027", title: "Roofing, services & finishes" },
  { phase: "Phase 4", date: "Dec 2027", title: "Infrastructure completion & handover" },
];

function toPlain<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

// 1. Published Blog Posts
export async function getPublicBlogPosts() {
  try {
    const ds = await getDatabaseConnection();
    const repo = ds.getRepository<BlogPost>("blog_posts");
    const posts = await repo.find({
      where: { published: true },
      order: { createdAt: "DESC" },
    });
    if (posts && posts.length > 0) {
      return toPlain(posts);
    }
  } catch (err) {
    console.warn("Could not fetch DB blog posts, falling back to static constants:", err);
  }
  return toPlain(BLOG_POSTS);
}

// 2. Published FAQs
export async function getPublicFaqs() {
  try {
    const ds = await getDatabaseConnection();
    const repo = ds.getRepository<FaqItem>("faq_items");
    const items = await repo.find({
      where: { published: true },
      order: { sortOrder: "ASC", createdAt: "ASC" },
    });
    if (items && items.length > 0) {
      return toPlain(items.map((i) => ({ q: i.question, a: i.answer })));
    }
  } catch (err) {
    console.warn("Could not fetch DB FAQs, falling back to static constants:", err);
  }
  return [];
}

// 3. Construction Milestones Timeline
export async function getPublicMilestones() {
  try {
    const ds = await getDatabaseConnection();
    const repo =
      ds.getRepository<ConstructionMilestone>("construction_milestones");
    const milestones = await repo.find({
      order: { phaseNumber: "ASC" },
    });
    if (milestones && milestones.length > 0) {
      return toPlain(
        milestones.map((m) => ({
          phase: `Phase ${m.phaseNumber}`,
          date: m.date,
          title: m.title,
        }))
      );
    }
  } catch (err) {
    console.warn("Could not fetch DB milestones, falling back to static constants:", err);
  }
  return toPlain(DEFAULT_MILESTONES);
}

// 4. Live Property Units
export async function getPublicUnits() {
  try {
    const ds = await getDatabaseConnection();
    const repo = ds.getRepository<PropertyUnit>("property_units");
    const units = await repo.find({
      order: { id: "ASC" },
    });
    if (units && units.length > 0) {
      return toPlain(units);
    }
  } catch (err) {
    console.warn("Could not fetch DB units:", err);
  }
  return [];
}

// 5. Site Config
export async function getPublicSiteConfig() {
  try {
    const ds = await getDatabaseConnection();
    const repo = ds.getRepository<SiteConfig>("site_config");
    const configs = await repo.find();
    const result: Record<string, unknown> = {};
    for (const item of configs) {
      try {
        result[item.key] = JSON.parse(item.value);
      } catch {
        result[item.key] = item.value;
      }
    }
    return result;
  } catch (err) {
    console.warn("Could not fetch site config:", err);
    return {};
  }
}

export async function getPublicFacilities(): Promise<Facility[]> {
  try {
    const ds = await getDatabaseConnection();
    const config = await ds
      .getRepository<SiteConfig>("site_config")
      .findOne({ where: { key: "facilities" } });

    if (!config) {
      return DEFAULT_FACILITIES.map((facility) => ({ ...facility }));
    }

    const facilities = normalizeFacilities(JSON.parse(config.value));
    if (facilities) {
      return toPlain(facilities);
    }

    console.warn(
      "Could not parse configured Fidelis Court facilities; using defaults."
    );
  } catch (err) {
    console.warn("Could not fetch Fidelis Court facilities; using defaults:", err);
  }

  return DEFAULT_FACILITIES.map((facility) => ({ ...facility }));
}

export async function getPublicOtherProjects(): Promise<OtherProject[]> {
  const config = await (await getDatabaseConnection())
    .getRepository<SiteConfig>("site_config")
    .findOne({ where: { key: "other_projects" } });
  if (!config) return [];

  let value: unknown;
  try {
    value = JSON.parse(config.value);
  } catch (error) {
    throw new Error("Stored other projects are not valid JSON.", { cause: error });
  }

  const projects = normalizeOtherProjects(value);
  if (!projects) {
    throw new Error("Stored other projects have an invalid format.");
  }
  return toPlain(projects);
}

export async function getPublicCareerOpenings(): Promise<CareerOpening[]> {
  const config = await (await getDatabaseConnection())
    .getRepository<SiteConfig>("site_config")
    .findOne({ where: { key: "career_openings" } });
  if (!config) return [];

  let value: unknown;
  try {
    value = JSON.parse(config.value);
  } catch (error) {
    throw new Error("Stored career openings are not valid JSON.", { cause: error });
  }

  const openings = normalizeCareerOpenings(value);
  if (!openings) {
    throw new Error("Stored career openings have an invalid format.");
  }
  return toPlain(openings);
}
