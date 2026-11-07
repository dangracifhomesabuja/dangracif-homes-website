import { EntitySchema } from "typeorm";

export class BlogPost {
  id!: string;
  title!: string;
  summary!: string;
  expandedContent!: string;
  imageSrc!: string;
  imageAlt!: string;
  imageCaption!: string;
  date!: string;
  linkText!: string;
  linkHref!: string;
  sortOrder!: number;
  published!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}

export const BlogPostSchema = new EntitySchema<BlogPost>({
  target: BlogPost,
  name: "BlogPost",
  tableName: "blog_posts",
  columns: {
    id: { type: "uuid", primary: true, generated: "uuid" },
    title: { type: "varchar", length: 255 },
    summary: { type: "text", default: "" },
    expandedContent: { type: "text", default: "" },
    imageSrc: { type: "varchar", length: 500, default: "" },
    imageAlt: { type: "varchar", length: 255, default: "" },
    imageCaption: { type: "varchar", length: 255, default: "" },
    date: { type: "varchar", length: 100, default: "" },
    linkText: { type: "varchar", length: 255, default: "" },
    linkHref: { type: "varchar", length: 500, default: "" },
    sortOrder: { type: "int", default: 0 },
    published: { type: "boolean", default: true },
    createdAt: { type: "timestamp with time zone", createDate: true },
    updatedAt: { type: "timestamp with time zone", updateDate: true },
  },
});
