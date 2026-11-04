"use client";

import * as React from "react";
import Image from "next/image";
import { CalendarCheck, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteImage } from "@/components/common/site-images-provider";

interface HeroSectionProps {
  onBookInspectionClick?: () => void;
  onReserveClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onBookInspectionClick,
  onReserveClick,
}) => {
  const heroImage = useSiteImage(
    "/fidelis-court/Apartment Building Under Construction.png"
  );

  return (
    <section
      className="relative w-full flex items-center overflow-hidden min-h-[580px] sm:min-h-[620px] lg:min-h-[680px]"
      style={{ minHeight: "87dvh" }}
    >
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt="Fidelis Court Estate, Kubwa F01, Abuja"
          fill
          priority
          className="object-cover object-[center_35%] sm:object-[center_30%]"
          sizes="100vw"
        />
        {/* Deep navy overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06152f]/95 via-[#101d39]/70 to-[#182033]/50" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 w-full">
        <div className="max-w-xl sm:max-w-2xl lg:max-w-[720px] space-y-4 sm:space-y-5">
          {/* Tag Pill */}
          <div className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 sm:px-5 py-1.5 text-[11px] sm:text-[12px] font-semibold uppercase tracking-wide text-white/90 backdrop-blur-md">
            <span>Now Selling · Kubwa F01, Abuja</span>
          </div>

          {/* Headline */}
          <h1 className="text-[32px] sm:text-4xl md:text-[44px] lg:text-[52px] font-light text-white tracking-tight leading-[1.18]">
            <span className="font-extrabold tracking-wide text-white">
              Fidelis Court.
            </span>{" "}
            Secure, serviced and peaceful living in the exclusive neighborhood of Kubwa.
          </h1>

          {/* Subtitle */}
          <p className="text-[14px] sm:text-base lg:text-[17px] font-medium text-slate-200 max-w-xl leading-relaxed">
            1 & 2-bedroom apartments and 4-bedroom terraces from ₦55.5M, with a
            flexible 12-month payment plan.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-3">
            <Button
              variant="primary"
              size="lg"
              onClick={onBookInspectionClick}
              className="h-[52px]"
              leftIcon={<CalendarCheck className="h-5 w-5" />}
            >
              Book an Inspection
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={onReserveClick}
              className="h-[52px]"
              leftIcon={<KeyRound className="h-5 w-5" />}
            >
              Reserve a Unit
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
