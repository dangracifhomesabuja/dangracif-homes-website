import { MigrationInterface, QueryRunner } from "typeorm";
import { DEFAULT_OTHER_PROJECTS } from "./1730000000000-SeedProjectsAndCareers";

const LEGACY_MALL_TITLE = "Commercial development · Dangracif Mall";
const LEGACY_MALL_DESCRIPTION =
  "Our company profile also includes Dangracif Mall in Kubwa, Abuja: a commercial development envisioned for retail, services and business activities, with a focus on functionality, accessibility and commercial value.";

interface StoredProject {
  id?: unknown;
  title?: unknown;
  description?: unknown;
  [key: string]: unknown;
}

function getDefaultProjects(): StoredProject[] {
  return JSON.parse(DEFAULT_OTHER_PROJECTS) as StoredProject[];
}

export class UpdateOtherProjectContent1731000000000
  implements MigrationInterface
{
  name = "UpdateOtherProjectContent1731000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const defaults = getDefaultProjects();
    const result = (await queryRunner.query(
      `SELECT "value" FROM "site_config" WHERE "key" = $1`,
      ["other_projects"]
    )) as { value: string }[];

    if (result.length === 0) {
      await queryRunner.query(
        `INSERT INTO "site_config" ("key", "value") VALUES ($1, $2)
         ON CONFLICT ("key") DO NOTHING`,
        ["other_projects", JSON.stringify(defaults)]
      );
      return;
    }

    let projects: StoredProject[];
    try {
      const parsed: unknown = JSON.parse(result[0].value);
      if (
        !Array.isArray(parsed) ||
        !parsed.every((item) => item && typeof item === "object")
      ) {
        throw new Error("Stored other_projects value is not a project list.");
      }
      projects = parsed as StoredProject[];
    } catch (error) {
      throw new Error("Could not migrate other_projects site configuration.", {
        cause: error,
      });
    }

    const defaultMall = defaults.find((project) => project.id === "dangracif-mall");
    const defaultNest = defaults.find((project) => project.id === "dangracif-nest");
    if (!defaultMall || !defaultNest) {
      throw new Error("Default Dangracif Mall or Dangracif Nest content is missing.");
    }

    const mall = projects.find((project) => project.id === "dangracif-mall");
    if (
      mall?.title === LEGACY_MALL_TITLE &&
      mall.description === LEGACY_MALL_DESCRIPTION
    ) {
      Object.assign(mall, defaultMall);
    } else if (!mall) {
      projects.push(defaultMall);
    }

    if (!projects.some((project) => project.id === "dangracif-nest")) {
      projects.push(defaultNest);
    }

    await queryRunner.query(
      `UPDATE "site_config" SET "value" = $1, "updatedAt" = now()
       WHERE "key" = $2`,
      [JSON.stringify(projects), "other_projects"]
    );
  }

  public async down(): Promise<void> {
    // Keep project content intact when reverting this data-only migration.
  }
}
