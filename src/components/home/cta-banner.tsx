"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface CtaBannerProps {
  className?: string;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ className }) => {
  return (
    <section
      className={cn(
        "w-full bg-gradient-to-r from-[#0064CF] to-[#0093ED] py-10 sm:py-14 text-white relative overflow-hidden flex flex-col justify-center",
        className
      )}
    >
      <div className="max-w-4xl mx-auto px-6 sm:px-6 lg:px-8 text-center space-y-4 sm:space-y-6 relative z-10 my-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[36px] font-extrabold tracking-tight max-w-2xl mx-auto leading-snug">
          <span className="block">Start with just 40% and spread the</span>
          <span className="block">rest over 12 months.</span>
        </h2>

        <div>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center px-8 py-3.5 sm:py-4 rounded-full bg-white text-[#0064CF] font-bold text-sm sm:text-base shadow-md hover:bg-zinc-50 hover:shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            Calculate your payment
          </Link>
        </div>
      </div>
    </section>
  );
};
