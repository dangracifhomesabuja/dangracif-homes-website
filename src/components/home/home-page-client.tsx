"use client";

import * as React from "react";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { OpenHouseSection } from "@/components/home/open-house-section";
import { ConstructionSection } from "@/components/home/construction-section";
import { BrochureBanner } from "@/components/home/brochure-banner";
import { HomesSection } from "@/components/home/homes-section";
import { AmenitiesSection } from "@/components/home/amenities-section";
import { ActionCardsSection } from "@/components/home/action-cards-section";
import { FaqSection } from "@/components/home/faq-section";
import { CtaBanner } from "@/components/home/cta-banner";

export default function HomePageClient() {
  const scrollToContact = () => {
    const target =
      document.getElementById("open-house") || document.getElementById("faq");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFCFE] text-zinc-900 flex flex-col antialiased">
      <Header onBookInspectionClick={scrollToContact} />
      <main className="flex-1 flex flex-col">
        <div className="order-1">
          <HeroSection
            onBookInspectionClick={scrollToContact}
            onReserveClick={scrollToContact}
          />
        </div>
        <div className="order-2">
          <StatsSection />
        </div>
        <div className="order-3">
          <HomesSection />
        </div>
        <div id="open-house" className="order-[8] sm:order-[11]">
          <OpenHouseSection />
        </div>
        <div className="order-[4] sm:order-[6]">
          <BrochureBanner />
        </div>
        <div className="order-[5] sm:hidden w-full">
          <CtaBanner onCalculateClick={scrollToContact} />
        </div>
        <div className="order-[6] sm:order-[7]">
          <AmenitiesSection />
        </div>
        <div className="order-[7] sm:order-[8]">
          <ActionCardsSection />
        </div>
        <div className="order-[9] sm:order-[5]">
          <ConstructionSection />
        </div>
        <div className="order-[10]">
          <FaqSection />
        </div>
      </main>
      <div className="w-full sm:min-h-[calc(100dvh-4.5rem)] lg:min-h-[540px] sm:flex sm:flex-col sm:justify-between hidden">
        <CtaBanner onCalculateClick={scrollToContact} className="shrink-0" />
        <Footer compact />
      </div>
      <div className="sm:hidden">
        <Footer compact />
      </div>
    </div>
  );
}
