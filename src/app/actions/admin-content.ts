"use server";

import "reflect-metadata";
import { revalidatePath } from "next/cache";
import { getDatabaseConnection } from "@/lib/db/data-source";
import { BlogPost } from "@/lib/db/entities/BlogPost";
import { FaqItem } from "@/lib/db/entities/FaqItem";
import { ConstructionMilestone } from "@/lib/db/entities/ConstructionMilestone";
import { SiteConfig } from "@/lib/db/entities/SiteConfig";
import { getAdminSession } from "@/lib/auth";
import { ILike } from "typeorm";
import { normalizeFacilities } from "@/constants/facilities";
import {
  normalizeOtherProjects,
  type OtherProject,
} from "@/constants/other-projects";
import {
  normalizeCareerOpenings,
  type CareerOpening,
} from "@/constants/careers";
import { sanitizeBlogContent } from "@/lib/blog-content";
import { getBlogPostOrderSettings } from "@/lib/db/blog-post-order";

function toPlain<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

async function requireAuth() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Unauthorized. Please log in.");
  }
  return session;
}

/* =========================================================================
 * 1. BLOG POSTS
 * ========================================================================= */

export async function getBlogPosts(search?: string): Promise<BlogPost[]> {
  await requireAuth();
  const ds = await getDatabaseConnection();
  const repo = ds.getRepository<BlogPost>("blog_posts");
  const { hasSortOrder, order, select } = await getBlogPostOrderSettings(ds);
  const whereClause = search
    ? [{ title: ILike(`%${search}%`) }, { summary: ILike(`%${search}%`) }]
    : {};

  const posts = await repo.find({ where: whereClause, order, select });

  return toPlain(
    posts.map((post) => ({
      ...post,
      sortOrder: hasSortOrder ? post.sortOrder : -1,
      expandedContent: sanitizeBlogContent(post.expandedContent ?? ""),
    }))
  );
}

export async function getBlogPostById(id: string) {
  await requireAuth();
  const ds = await getDatabaseConnection();
  const repo = ds.getRepository<BlogPost>("blog_posts");
  const post = await repo.findOne({ where: { id } });
  return post
    ? toPlain({
        ...post,
        expandedContent: sanitizeBlogContent(post.expandedContent ?? ""),
      })
    : null;
}

export async function saveBlogPost(data: {
  id?: string;
  title: string;
  summary?: string;
  expandedContent?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageCaption?: string;
  date?: string;
  linkText?: string;
  linkHref?: string;
  published?: boolean;
}) {
  await requireAuth();
  const linkText = data.linkText?.trim() ?? "";
  const linkHref = data.linkHref?.trim() ?? "";
  const expandedContent = sanitizeBlogContent(data.expandedContent ?? "");
  if ((data.imageSrc?.length ?? 0) > 500) {
    throw new Error("Cover image URL must be 500 characters or fewer.");
  }
  if ((data.imageAlt?.length ?? 0) > 255) {
    throw new Error("Image alt text must be 255 characters or fewer.");
  }
  if ((data.imageCaption?.length ?? 0) > 255) {
    throw new Error("Image caption must be 255 characters or fewer.");
  }
  if (linkText.length > 255 || linkHref.length > 500) {
    throw new Error("Card link label or URL is too long.");
  }
  if (Boolean(linkText) !== Boolean(linkHref)) {
    throw new Error("Enter both a card link label and URL, or leave both empty.");
  }
  if (
    linkHref &&
    !/^https?:\/\//i.test(linkHref) &&
    !(linkHref.startsWith("/") && !linkHref.startsWith("//"))
  ) {
    throw new Error("Card link URL must use http(s) or start with a single /.");
  }

  const ds = await getDatabaseConnection();
  const repo = ds.getRepository<BlogPost>("blog_posts");
  const { hasSortOrder } = await getBlogPostOrderSettings(ds);

  let post: BlogPost;
  if (data.id) {
    const existing = await repo.findOne({ where: { id: data.id } });
    if (!existing) throw new Error("Blog post not found");
    post = repo.merge(existing, {
      ...data,
      expandedContent,
      linkText,
      linkHref,
      published: data.published ?? true,
    });
  } else {
    const lastPost = hasSortOrder
      ? await repo.findOne({
          select: { sortOrder: true },
          order: { sortOrder: "DESC", createdAt: "DESC" },
        })
      : null;
    post = repo.create({
      ...data,
      summary: data.summary || "",
      expandedContent,
      imageSrc: data.imageSrc || "",
      imageAlt: data.imageAlt || "",
      imageCaption: data.imageCaption || "",
      date: data.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      linkText,
      linkHref,
      ...(hasSortOrder && { sortOrder: (lastPost?.sortOrder ?? -1) + 1 }),
      published: data.published ?? true,
    });
  }

  const saved = await repo.save(post);
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return toPlain({ ...saved, sortOrder: hasSortOrder ? saved.sortOrder : -1 });
}

export async function reorderBlogPosts(orderedIds: string[]) {
  await requireAuth();
  if (
    !Array.isArray(orderedIds) ||
    orderedIds.some((id) => typeof id !== "string" || !id) ||
    new Set(orderedIds).size !== orderedIds.length
  ) {
    throw new Error("Invalid blog post order.");
  }

  const ds = await getDatabaseConnection();
  const { hasSortOrder } = await getBlogPostOrderSettings(ds);
  if (!hasSortOrder) {
    throw new Error(
      "Apply the blog ordering migration before rearranging articles."
    );
  }
  await ds.transaction(async (manager) => {
    const repo = manager.getRepository<BlogPost>("blog_posts");
    const posts = await repo.find({ lock: { mode: "pessimistic_write" } });
    const existingIds = new Set(posts.map((post) => post.id));
    if (
      orderedIds.length !== existingIds.size ||
      orderedIds.some((id) => !existingIds.has(id))
    ) {
      throw new Error("The blog list changed. Refresh the page and try again.");
    }

    for (const [sortOrder, id] of orderedIds.entries()) {
      await repo.update({ id }, { sortOrder });
    }
  });

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return { success: true };
}

export async function deleteBlogPost(id: string) {
  await requireAuth();
  const ds = await getDatabaseConnection();
  const repo = ds.getRepository<BlogPost>("blog_posts");
  await repo.delete({ id });
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return { success: true };
}

export async function toggleBlogPostPublished(id: string) {
  await requireAuth();
  const ds = await getDatabaseConnection();
  const repo = ds.getRepository<BlogPost>("blog_posts");
  const post = await repo.findOne({ where: { id } });
  if (!post) throw new Error("Blog post not found");

  post.published = !post.published;
  const saved = await repo.save(post);
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return toPlain(saved);
}

/* =========================================================================
 * 2. FAQ ITEMS
 * ========================================================================= */

export async function getFaqItems(search?: string): Promise<FaqItem[]> {
  await requireAuth();
  try {
    const ds = await getDatabaseConnection();
    const repo = ds.getRepository<FaqItem>("faq_items");

    const whereClause = search
      ? [{ question: ILike(`%${search}%`) }, { answer: ILike(`%${search}%`) }]
      : {};

    const items = await repo.find({
      where: whereClause,
      order: { sortOrder: "ASC", createdAt: "ASC" },
    });

    return toPlain(items);
  } catch (err) {
    console.warn("Could not fetch DB FAQ items for admin, returning fallback:", err);
    const fallbackItems: FaqItem[] = [
      {
        id: "faq-1",
        question: "Where is Fidelis Court located?",
        answer: "Fidelis Court is situated at 21, Josephat Mojeckwu Avenue, Kubwa F01, Abuja.",
        published: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return toPlain(fallbackItems);
  }
}

export async function saveFaqItem(data: {
  id?: string;
  question: string;
  answer: string;
  sortOrder?: number;
  published?: boolean;
}) {
  await requireAuth();
  const ds = await getDatabaseConnection();
  const repo = ds.getRepository<FaqItem>("faq_items");

  let faq: FaqItem;
  if (data.id) {
    const existing = await repo.findOne({ where: { id: data.id } });
    if (!existing) throw new Error("FAQ item not found");
    faq = repo.merge(existing, {
      ...data,
      published: data.published ?? true,
    });
  } else {
    // calculate next sortOrder
    const count = await repo.count();
    faq = repo.create({
      ...data,
      sortOrder: data.sortOrder ?? count,
      published: data.published ?? true,
    });
  }

  const saved = await repo.save(faq);
  revalidatePath("/");
  revalidatePath("/admin/faqs");
  return toPlain(saved);
}

export async function reorderFaqItems(orderedIds: string[]) {
  await requireAuth();
  if (
    !Array.isArray(orderedIds) ||
    orderedIds.some((id) => typeof id !== "string" || !id) ||
    new Set(orderedIds).size !== orderedIds.length
  ) {
    throw new Error("Invalid FAQ order.");
  }

  const ds = await getDatabaseConnection();
  await ds.transaction(async (manager) => {
    const repo = manager.getRepository<FaqItem>("faq_items");
    const items = await repo.find({ lock: { mode: "pessimistic_write" } });
    const existingIds = new Set(items.map((item) => item.id));
    if (
      orderedIds.length !== existingIds.size ||
      orderedIds.some((id) => !existingIds.has(id))
    ) {
      throw new Error("The FAQ list changed. Refresh the page and try again.");
    }

    for (const [sortOrder, id] of orderedIds.entries()) {
      await repo.update({ id }, { sortOrder });
    }
  });

  revalidatePath("/");
  revalidatePath("/admin/faqs");
  return { success: true };
}

export async function deleteFaqItem(id: string) {
  await requireAuth();
  const ds = await getDatabaseConnection();
  const repo = ds.getRepository<FaqItem>("faq_items");
  await repo.delete({ id });
  revalidatePath("/");
  revalidatePath("/admin/faqs");
  return { success: true };
}

export async function toggleFaqPublished(id: string) {
  await requireAuth();
  const ds = await getDatabaseConnection();
  const repo = ds.getRepository<FaqItem>("faq_items");
  const item = await repo.findOne({ where: { id } });
  if (!item) throw new Error("FAQ item not found");

  item.published = !item.published;
  const saved = await repo.save(item);
  revalidatePath("/");
  revalidatePath("/admin/faqs");
  return toPlain(saved);
}

/* =========================================================================
 * 3. CONSTRUCTION MILESTONES
 * ========================================================================= */

export async function getMilestones(): Promise<ConstructionMilestone[]> {
  await requireAuth();
  try {
    const ds = await getDatabaseConnection();
    const repo =
      ds.getRepository<ConstructionMilestone>("construction_milestones");
    const items = await repo.find({
      order: { phaseNumber: "ASC" },
    });
    return toPlain(items);
  } catch (err) {
    console.warn("Could not fetch DB milestones for admin, returning fallback:", err);
    const fallbackDate = new Date();
    const fallbackMilestones: ConstructionMilestone[] = [
      {
        id: "m-1",
        phaseNumber: 1,
        date: "Apr 2026",
        title: "Groundbreaking & site mobilisation",
        createdAt: fallbackDate,
        updatedAt: fallbackDate,
      },
      {
        id: "m-2",
        phaseNumber: 2,
        date: "Oct 2026 – Jun 2027",
        title: "Substructure & superstructure works",
        createdAt: fallbackDate,
        updatedAt: fallbackDate,
      },
      {
        id: "m-3",
        phaseNumber: 3,
        date: "Jul – Nov 2027",
        title: "Roofing, services & finishes",
        createdAt: fallbackDate,
        updatedAt: fallbackDate,
      },
      {
        id: "m-4",
        phaseNumber: 4,
        date: "Dec 2027",
        title: "Infrastructure completion & handover",
        createdAt: fallbackDate,
        updatedAt: fallbackDate,
      },
    ];
    return toPlain(fallbackMilestones);
  }
}

export async function saveMilestone(data: {
  id?: string;
  phaseNumber: number;
  date: string;
  title: string;
}) {
  await requireAuth();
  const ds = await getDatabaseConnection();
  const repo =
    ds.getRepository<ConstructionMilestone>("construction_milestones");

  let milestone: ConstructionMilestone;
  if (data.id) {
    const existing = await repo.findOne({ where: { id: data.id } });
    if (!existing) throw new Error("Milestone not found");
    milestone = repo.merge(existing, data);
  } else {
    milestone = repo.create(data);
  }

  const saved = await repo.save(milestone);
  revalidatePath("/");
  revalidatePath("/admin/timeline");
  return toPlain(saved);
}

export async function deleteMilestone(id: string) {
  await requireAuth();
  const ds = await getDatabaseConnection();
  const repo =
    ds.getRepository<ConstructionMilestone>("construction_milestones");
  await repo.delete({ id });
  revalidatePath("/");
  revalidatePath("/admin/timeline");
  return { success: true };
}

/* =========================================================================
 * 4. SITE CONFIGURATION
 * ========================================================================= */

export async function getSiteConfigs(): Promise<Record<string, unknown>> {
  await requireAuth();
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
    console.warn("Could not fetch DB site configs, returning defaults:", err);
    return {
      site_name: "Dangracif Homes",
      estate_title: "Fidelis Court",
      estate_location: "21, Josephat Mojeckwu Avenue, Kubwa F01, Abuja",
      sales_phone: "+234 813 318 7860",
      sales_email: "info@dangracif.com",
    };
  }
}

export async function saveSiteConfig(key: string, value: unknown) {
  await requireAuth();
  const ds = await getDatabaseConnection();
  const repo = ds.getRepository<SiteConfig>("site_config");

  const stringVal =
    typeof value === "string" ? value : JSON.stringify(value) ?? "";
  let item = await repo.findOne({ where: { key } });

  if (item) {
    item.value = stringVal;
  } else {
    item = repo.create({ key, value: stringVal });
  }

  await repo.save(item);
  revalidatePath("/");
  revalidatePath("/admin/site-config");
  return { success: true, key, value };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSafeFooterUrl(value: unknown): boolean {
  if (typeof value !== "string") return false;
  if (!value) return true;
  return /^https?:\/\//i.test(value);
}

function isValidFooterConfig(value: unknown): boolean {
  if (!isRecord(value)) return false;

  const textFields = [
    "companyName",
    "registrationNumber",
    "officeName",
    "officeAddress",
    "email",
    "projectName",
    "projectAddress",
  ];
  if (!textFields.every((field) => typeof value[field] === "string")) {
    return false;
  }
  if (
    !Array.isArray(value.officePhones) ||
    !value.officePhones.every((phone) => typeof phone === "string") ||
    !Array.isArray(value.marketingPhones) ||
    !value.marketingPhones.every((phone) => typeof phone === "string") ||
    !Array.isArray(value.socialLinks) ||
    !value.socialLinks.every(
      (link) =>
        isRecord(link) &&
        ["instagram", "youtube", "facebook", "website"].includes(
          String(link.platform)
        ) &&
        typeof link.label === "string" &&
        isSafeFooterUrl(link.href)
    )
  ) {
    return false;
  }

  return true;
}

export async function saveMultipleSiteConfigs(
  configs: Record<string, unknown>
) {
  await requireAuth();
  if (
    Object.prototype.hasOwnProperty.call(configs, "footer") &&
    !isValidFooterConfig(configs.footer)
  ) {
    throw new Error(
      "Footer items contain invalid data. Check that links use http(s) or a site-relative path."
    );
  }

  const includesFacilities = Object.prototype.hasOwnProperty.call(
    configs,
    "facilities"
  );
  const facilities = includesFacilities
    ? normalizeFacilities(configs.facilities)
    : null;
  if (includesFacilities && !facilities) {
    throw new Error("Please provide valid facility names and icons.");
  }
  if (Object.prototype.hasOwnProperty.call(configs, "site_image_captions")) {
    const captions = configs.site_image_captions;
    if (
      !isRecord(captions) ||
      !Object.entries(captions).every(
        ([, caption]) =>
          typeof caption === "string" && caption.length <= 255
      )
    ) {
      throw new Error(
        "Gallery captions must be text no longer than 255 characters."
      );
    }
  }

  const ds = await getDatabaseConnection();
  const repo = ds.getRepository<SiteConfig>("site_config");

  for (const [key, val] of Object.entries(configs)) {
    const configValue = key === "facilities" ? facilities : val;
    const stringVal =
      typeof configValue === "string"
        ? configValue
        : JSON.stringify(configValue) ?? "";
    let item = await repo.findOne({ where: { key } });
    if (item) {
      item.value = stringVal;
    } else {
      item = repo.create({ key, value: stringVal });
    }
    await repo.save(item);
  }

  revalidatePath("/");
  revalidatePath("/fideliscourt");
  revalidatePath("/about");
  revalidatePath("/admin/site-config");
  return { success: true };
}

export async function getOtherProjects(): Promise<OtherProject[]> {
  await requireAuth();
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

export async function saveOtherProjects(value: unknown) {
  await requireAuth();
  const projects = normalizeOtherProjects(value);
  if (!projects) {
    throw new Error(
      "Each project must have a unique ID, title, description, location, and status."
    );
  }

  const ds = await getDatabaseConnection();
  const repo = ds.getRepository<SiteConfig>("site_config");
  let config = await repo.findOne({ where: { key: "other_projects" } });
  const serializedProjects = JSON.stringify(projects);
  if (config) {
    config.value = serializedProjects;
  } else {
    config = repo.create({ key: "other_projects", value: serializedProjects });
  }
  await repo.save(config);

  revalidatePath("/other-projects");
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function getCareerOpenings(): Promise<CareerOpening[]> {
  await requireAuth();
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

export async function saveCareerOpenings(value: unknown) {
  await requireAuth();
  const openings = normalizeCareerOpenings(value);
  if (!openings) {
    throw new Error(
      "Each career opening must have a unique ID, title, and description."
    );
  }

  const ds = await getDatabaseConnection();
  const repo = ds.getRepository<SiteConfig>("site_config");
  let config = await repo.findOne({ where: { key: "career_openings" } });
  const serializedOpenings = JSON.stringify(openings);
  if (config) {
    config.value = serializedOpenings;
  } else {
    config = repo.create({
      key: "career_openings",
      value: serializedOpenings,
    });
  }
  await repo.save(config);

  revalidatePath("/careers");
  revalidatePath("/admin/careers");
  return { success: true };
}
