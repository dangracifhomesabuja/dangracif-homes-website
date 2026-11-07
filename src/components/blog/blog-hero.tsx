import { BlogPost } from "@/constants/blog";
import { BlogCard } from "./blog-card";

interface BlogHeroProps {
  posts: BlogPost[];
}

export function BlogHero({ posts }: BlogHeroProps) {
  return (
    <section className="w-full bg-white py-6 sm:py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="space-y-2 mb-10 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00ABF0]">
            BLOG
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            News &amp; updates
          </h1>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600">
            No articles are available right now. Please check back soon.
          </p>
        )}
      </div>
    </section>
  );
}
