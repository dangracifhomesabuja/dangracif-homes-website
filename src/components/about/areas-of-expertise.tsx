"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";

const ROW_1 = [
  "Residential property development",
  "Commercial property development",
  "Property sales and marketing",
];

const ROW_2 = [
  "Project planning and coordination",
  "Property investment opportunities",
  "Approved finishing and customization",
];

export const AreasOfExpertise: React.FC = () => {
  return (
    <section className="w-full bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-3 mb-10 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00ABF0] block">
            OUR EXPERTISE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a192f] tracking-tight">
            From planning to property ownership
          </h2>
        </div>

        {/* 2-Row / 3-Column Grid with Horizontal Dividers */}
        <div className="space-y-4 md:space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pb-0 md:pb-6 border-b-0 md:border-b md:border-slate-200/80">
            {ROW_1.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <ArrowRight className="w-4 h-4 text-[#00ABF0] shrink-0" />
                <span className="text-sm sm:text-[15px] font-semibold text-[#0a192f]">
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pb-0 md:pb-6 border-b-0 md:border-b md:border-slate-200/80">
            {ROW_2.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <ArrowRight className="w-4 h-4 text-[#00ABF0] shrink-0" />
                <span className="text-sm sm:text-[15px] font-semibold text-[#0a192f]">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed mt-6 sm:mt-8">
          Our development work is supported by outsourced built-environment
          professionals and partners.
        </p>
      </div>
    </section>
  );
};
