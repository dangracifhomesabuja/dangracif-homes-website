import { getPublicBlogPosts } from "@/app/actions/public-content";
import { BlogPageClient } from "@/components/blog/blog-page-client";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPublicBlogPosts();
  return <BlogPageClient posts={posts} />;
}
