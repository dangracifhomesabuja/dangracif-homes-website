import type {
  DataSource,
  FindOptionsOrder,
  FindOptionsSelect,
} from "typeorm";
import { BlogPost } from "@/lib/db/entities/BlogPost";

export async function getBlogPostOrderSettings(ds: DataSource) {
  const rows: Array<{ hasSortOrder: boolean }> = await ds.query(`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = current_schema()
        AND table_name = 'blog_posts'
        AND column_name = 'sortOrder'
    ) AS "hasSortOrder"
  `);
  const hasSortOrder = rows[0]?.hasSortOrder === true;

  const order: FindOptionsOrder<BlogPost> = hasSortOrder
    ? { sortOrder: "ASC", createdAt: "DESC", id: "ASC" }
    : { createdAt: "DESC", id: "ASC" };
  const select: FindOptionsSelect<BlogPost> = {
    id: true,
    title: true,
    summary: true,
    expandedContent: true,
    imageSrc: true,
    imageAlt: true,
    imageCaption: true,
    date: true,
    linkText: true,
    linkHref: true,
    ...(hasSortOrder && { sortOrder: true }),
    published: true,
    createdAt: true,
    updatedAt: true,
  };

  return { hasSortOrder, order, select };
}
