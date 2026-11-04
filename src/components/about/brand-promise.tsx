"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export const BrandPromise: React.FC = () => {
  return (
    <section className="w-full bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#0754C6] via-[#0B3D91] to-[#04102a] p-8 sm:p-12 lg:p-16 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#60a5fa]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#0754C6]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              Our Brand Promise
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
              High Quality.{" "}
              <span className="text-[#00ABF0]">Affordable Options.</span>{" "}
              Lasting Value.
            </h2>

            {/* Description */}
            <p className="text-white/80 text-sm sm:text-base lg:text-lg leading-relaxed mb-8 max-w-2xl mx-auto font-medium">
              Dangracif Homes Limited makes quality housing opportunities more accessible through thoughtful development, professional service and a commitment to creating value for homeowners and investors.
            </p>

            {/* Corporate info pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
              {[
                "RC-1896142",
                "Abuja, Nigeria",
                "Real Estate & Property Development",
              ].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-[12px] font-medium text-white/80"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/fideliscourt"
                className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-white text-[#00ABF0] text-sm font-bold hover:bg-white/90 transition-all shadow-lg shadow-black/10 cursor-pointer"
              >
                View Our Projects
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border-2 border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-all cursor-pointer"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
