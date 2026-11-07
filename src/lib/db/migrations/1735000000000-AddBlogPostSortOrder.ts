import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBlogPostSortOrder1735000000000 implements MigrationInterface {
  name = "AddBlogPostSortOrder1735000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blog_posts" ADD COLUMN "sortOrder" integer NOT NULL DEFAULT 0`
    );
    await queryRunner.query(`
      WITH ordered_posts AS (
        SELECT "id", ROW_NUMBER() OVER (ORDER BY "createdAt" DESC, "id" ASC) - 1 AS position
        FROM "blog_posts"
      )
      UPDATE "blog_posts" AS posts
      SET "sortOrder" = ordered_posts.position
      FROM ordered_posts
      WHERE posts."id" = ordered_posts."id"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blog_posts" DROP COLUMN "sortOrder"`
    );
  }
}
