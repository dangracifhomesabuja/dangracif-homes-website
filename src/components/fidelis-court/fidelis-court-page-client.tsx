"use client";

import * as React from "react";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { ProjectHero } from "@/components/fidelis-court/project-hero";
import { ProjectHeroImage } from "@/components/fidelis-court/project-hero-image";
import { UnitMixSection } from "@/components/fidelis-court/unit-mix-section";
import { FidelisHomesSection } from "@/components/fidelis-court/fidelis-homes-section";
import { FidelisScrollGallery } from "@/components/fidelis-court/fidelis-scroll-gallery";
import { FidelisBrochureSection } from "@/components/fidelis-court/fidelis-brochure-section";
import { FacilitiesSection } from "@/components/fidelis-court/facilities-section";
import { ConstructionTimeline } from "@/components/fidelis-court/construction-timeline";
import { ConstructionSection } from "@/components/home/construction-section";
import { FidelisCtaCards } from "@/components/fidelis-court/fidelis-cta-cards";
import { LocationSection } from "@/components/fidelis-court/location-section";
import type { Facility } from "@/constants/facilities";

export default function FidelisCourtPageClient({
  facilities,
}: {
  facilities: Facility[];
}) {
  const scrollToContact = () => {
    const target = document.getElementById("contact");
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FAFCFE] text-zinc-900 flex flex-col antialiased">
      <Header onBookInspectionClick={scrollToContact} />
      <main className="flex-1">
        <ProjectHero />
        <ProjectHeroImage />
        <UnitMixSection />
        <FidelisHomesSection onReserveUnit={scrollToContact} />
        <FidelisScrollGallery />
        <FidelisBrochureSection onBookInspectionClick={scrollToContact} />
        <FacilitiesSection facilities={facilities} />
        <ConstructionTimeline />
        <ConstructionSection />
        <FidelisCtaCards />
        <LocationSection />
      </main>
      <Footer />
    </div>
  );
}
