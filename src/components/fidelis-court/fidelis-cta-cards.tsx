"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink, FileText, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTermsConditionsUrl } from "@/components/common/site-images-provider";

export const FidelisCtaCards: React.FC = () => {
  const termsConditionsUrl = useTermsConditionsUrl();

  return (
    <section className="w-full bg-[#FAFCFE] py-10 sm:py-14 border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 space-y-5">
        {/* Become an Agent — white bordered card */}
        <div className="w-full rounded-3xl bg-white border border-zinc-200 px-6 py-8 sm:px-8 sm:py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="mt-0.5 shrink-0 h-12 w-12 rounded-2xl bg-[#00ABF0]/10 flex items-center justify-center">
              <Handshake className="h-6 w-6 text-[#00ABF0]" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
                Become a Fidelis Court agent
              </h3>
              <p className="text-sm sm:text-base text-zinc-500">
                Refer buyers and earn commission on every successful sale.
              </p>
            </div>
          </div>
          <Link href="/become-an-agent">
            <Button variant="primary" size="lg" className="shrink-0 font-bold cursor-pointer">
              Apply now
            </Button>
          </Link>
        </div>
        <div className="w-full rounded-3xl bg-white border border-zinc-200 px-6 py-8 sm:px-8 sm:py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="mt-0.5 shrink-0 h-12 w-12 rounded-2xl bg-[#00ABF0]/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-[#00ABF0]" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
                Terms and Conditions
              </h3>
              <p className="text-sm sm:text-base text-zinc-500">
                Review the terms that apply to offers and purchases at Fidelis
                Court.
              </p>
            </div>
          </div>
          <a
            href={termsConditionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2.5 rounded-full bg-[#0754C6] px-7 text-base font-semibold text-white shadow-sm shadow-[#0754C6]/25 transition-all duration-200 ease-out hover:scale-[1.03] hover:-translate-y-0.5 hover:bg-[#0648AB] active:scale-95 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0754C6]"
          >
            View terms
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
