import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFidelisCourtMilestones1736000000000
  implements MigrationInterface
{
  name = "UpdateFidelisCourtMilestones1736000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "construction_milestones"
      SET "date" = CASE "phaseNumber"
        WHEN 1 THEN '01 December 2025'
        WHEN 2 THEN 'January 2026 – May 2027'
        WHEN 4 THEN 'Dec 2027'
      END
      WHERE "phaseNumber" IN (1, 2, 4)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "construction_milestones"
      SET "date" = CASE "phaseNumber"
        WHEN 1 THEN 'Apr 2026'
        WHEN 2 THEN 'Oct 2026 – Jun 2027'
        WHEN 4 THEN 'Dec 2027'
      END
      WHERE "phaseNumber" IN (1, 2, 4)
    `);
  }
}
