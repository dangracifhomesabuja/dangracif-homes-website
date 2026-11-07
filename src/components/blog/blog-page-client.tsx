"use client";

import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { BlogHero } from "@/components/blog/blog-hero";
import { BlogPost } from "@/constants/blog";

interface BlogPageClientProps {
  posts: BlogPost[];
}

export function BlogPageClient({ posts }: BlogPageClientProps) {
  const scrollToContact = () => {
    const target = document.getElementById("contact");
    target?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col antialiased">
      <Header onBookInspectionClick={scrollToContact} />
      <main className="flex-1">
        <BlogHero posts={posts} />
      </main>
      <Footer />
    </div>
  );
}
