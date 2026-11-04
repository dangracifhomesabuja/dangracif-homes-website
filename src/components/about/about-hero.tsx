"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSiteImage } from "@/components/common/site-images-provider";

export const AboutHero: React.FC = () => {
  const heroImage = useSiteImage(
    "/fidelis-court/WhatsApp Image 2026-10-17 at 9.57.51 PM.jpeg"
  );

  return (
    <section className="w-full bg-white pt-10 sm:pt-14 pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Narrative & Info */}
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00ABF0] block">
              ABOUT US
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-[#0a192f] tracking-tight leading-[1.1]">
              Dangracif Homes
              <br />
              Limited
            </h1>

            <p className="text-base sm:text-lg font-bold text-[#00ABF0]">
              High quality. Affordable options. Lasting value.
            </p>

            <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed max-w-xl">
              Dangracif Homes Limited is a Nigerian real estate development
              company focused on creating quality, affordable housing options for
              individuals, families and property investors. Our Abuja
              developments combine thoughtful planning, functional design and
              quality-conscious construction with a focus on long-term value.
            </p>

            <p className="text-xs sm:text-sm text-slate-500 font-medium pt-1">
              Registered in Nigeria · RC-1896142
            </p>

            <div className="pt-2">
              <Link
                href="/fideliscourt"
                className="group inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-xl bg-[#0754C6] hover:bg-[#0648AB] text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg shadow-[#0754C6]/25 cursor-pointer"
              >
                <span>Our current project</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Building Image */}
          <div className="lg:col-span-6">
            <div className="relative w-full aspect-[16/11] sm:aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-100 bg-slate-100">
              <Image
                src={heroImage}
                alt="Fidelis Court 4-bedroom terrace duplex development"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2.5 font-normal tracking-normal">
              Actual site photos · Fidelis Court
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
