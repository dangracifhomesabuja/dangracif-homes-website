"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  Download,
  CalendarCheck,
  Tag,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBrochureUrl } from "@/components/common/site-images-provider";

interface FidelisBrochureSectionProps {
  onBookInspectionClick?: () => void;
}

export const FidelisBrochureSection: React.FC<FidelisBrochureSectionProps> = ({
  onBookInspectionClick,
}) => {
  const brochureUrl = useBrochureUrl();

  return (
    <section className="w-full bg-[#FAFCFE] py-12 sm:py-16 border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 space-y-8">
        {/* 1. Brochure Download Card */}
        <div className="w-full rounded-3xl bg-gradient-to-r from-[#05142B] to-[#0754C6] px-6 py-10 sm:px-10 sm:py-14 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-lg shadow-[#0754C6]/15">
          <div className="flex items-start gap-4 max-w-2xl">
            <div className="h-14 w-14 rounded-2xl bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
              <FileText className="h-7 w-7 text-white" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-snug tracking-tight">
                Download the Fidelis Court brochure
              </h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                Prices, payment plan, fees, amenities and addresses — all in one PDF you can share.
              </p>
            </div>
          </div>
          <a
            href={brochureUrl}
            download
            className="shrink-0 self-start sm:self-auto"
          >
            <Button
              variant="secondary"
              size="lg"
              leftIcon={<Download className="h-5 w-5 text-[#00ABF0]" />}
              className="bg-white text-[#00ABF0] font-bold hover:bg-zinc-50 border-white shadow-md active:scale-95 cursor-pointer"
            >
              Download brochure
            </Button>
          </a>
        </div>

        {/* 2. Book an inspection and View pricing buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/book-inspection" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              onClick={onBookInspectionClick}
              leftIcon={<CalendarCheck className="h-5 w-5" />}
              className="w-full sm:w-auto h-13 px-8 text-base font-bold shadow-md shadow-[#0754C6]/25 cursor-pointer"
            >
              Book an Inspection
            </Button>
          </Link>

          <Link href="/pricing" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              leftIcon={<Tag className="h-5 w-5" />}
              rightIcon={<ArrowRight className="h-4 w-4" />}
              className="w-full sm:w-auto h-13 px-8 text-base font-bold bg-white shadow-xs cursor-pointer"
            >
              View Pricing
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
