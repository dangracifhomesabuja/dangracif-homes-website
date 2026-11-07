"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { BlogPost } from "@/constants/blog";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  post: BlogPost;
}

function isSafeCardLink(href: string) {
  return (
    /^https?:\/\//i.test(href) ||
    (href.startsWith("/") && !href.startsWith("//"))
  );
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [failedImageSrc, setFailedImageSrc] = React.useState<string | null>(null);

  return (
    <article className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-fit">
      {/* Top Image */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
        {post.imageSrc && failedImageSrc !== post.imageSrc ? (
          <Image
            key={post.imageSrc}
            src={post.imageSrc}
            alt={post.imageAlt || post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setFailedImageSrc(post.imageSrc)}
          />
        ) : (
          <div
            role="img"
            aria-label={`${post.title} cover image unavailable`}
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-6 text-center text-sm font-medium text-slate-500"
          >
            Image unavailable
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="px-4 py-3 sm:px-5 sm:py-4 flex flex-col flex-1">
        <p className="text-xs text-slate-600">
          {post.imageCaption}
        </p>

        <span className="text-xs font-bold uppercase tracking-wider text-[#00ABF0] mt-4 block">
          {post.date}
        </span>

        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mt-2 tracking-tight leading-snug">
          {post.title}
        </h2>

        <p className="text-sm text-slate-800 leading-relaxed mt-2.5">
          {post.summary}
        </p>

        {/* Read more / Read less toggle button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00ABF0] hover:text-[#00ABF0]/80 transition-colors cursor-pointer group"
          >
            <span>{isExpanded ? "Read less" : "Read more"}</span>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-[#00ABF0] transition-transform duration-200",
                isExpanded && "rotate-180"
              )}
            />
          </button>
        </div>

        {post.linkText?.trim() &&
          post.linkHref?.trim() &&
          isSafeCardLink(post.linkHref) && (
            <div className="pt-3">
              {post.linkHref.startsWith("/") ? (
                <Link
                  href={post.linkHref}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00ABF0] hover:text-[#00ABF0]/80 hover:gap-2 transition-all"
                >
                  <span>{post.linkText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <a
                  href={post.linkHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00ABF0] hover:text-[#00ABF0]/80 hover:gap-2 transition-all"
                >
                  <span>{post.linkText}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </div>
          )}

        {/* Expanded Content */}
        {isExpanded && (
          <div className="pt-4 mt-3 border-t border-slate-300 space-y-4 animate-in fade-in duration-200">
            <div
              className="blog-rich-content text-sm text-slate-700"
              dangerouslySetInnerHTML={{ __html: post.expandedContent }}
            />
          </div>
        )}
      </div>
    </article>
  );
};
