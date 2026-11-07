"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Images, Maximize2, X } from "lucide-react";
import {
  useSiteImageCaptionResolver,
  useSiteImageResolver,
} from "@/components/common/site-images-provider";

interface UnitModel {
  id: string;
  title: string;
  subtitle: string;
  unitsCount: number;
  price: string;
  mainImage: string;
  galleryImages: {
    src: string;
    caption: string;
  }[];
}

const FIDELIS_UNITS: UnitModel[] = [
  {
    id: "1-bed",
    title: "1-Bedroom Apartment",
    subtitle: "Compact, efficient city living",
    unitsCount: 32,
    price: "₦55.5M",
    mainImage: "/fidelis-court/Bright Renovation Room with Window Views.png",
    galleryImages: [
      {
        src: "/fidelis-court/Bright Renovation Room with Window Views.png",
        caption: "1-Bedroom living area",
      },
      {
        src: "/fidelis-court/Bright Unfinished Room Under Construction.png",
        caption: "Open kitchen & dining layout",
      },
      {
        src: "/fidelis-court/Bright Unfinished Hallway Renovation.png",
        caption: "Bedroom suite & natural lighting",
      },
    ],
  },
  {
    id: "2-bed",
    title: "2-Bedroom Apartment",
    subtitle: "Ideal for young families & professionals",
    unitsCount: 48,
    price: "₦82.5M",
    mainImage: "/fidelis-court/Sunlit Unfinished Room Renovation.png",
    galleryImages: [
      {
        src: "/fidelis-court/Sunlit Unfinished Room Renovation.png",
        caption: "2-Bedroom living area",
      },
      {
        src: "/fidelis-court/Unfinished Room Under Renovation.png",
        caption: "Dining area & interior layout",
      },
      {
        src: "/fidelis-court/Bright Unfinished Room with Exposed Wiring.png",
        caption: "Master suite with corner windows",
      },
    ],
  },
  {
    id: "4-bed-terrace",
    title: "4-Bedroom Terrace (Shell)",
    subtitle: "Shell option — finish to your taste",
    unitsCount: 8,
    price: "₦127.5M",
    mainImage: "/fidelis-court/Vibrant Mid-Rise Construction Site.png",
    galleryImages: [
      {
        src: "/fidelis-court/Vibrant Mid-Rise Construction Site.png",
        caption: "Terrace exterior",
      },
      {
        src: "/fidelis-court/Apartment Building Under Construction.png",
        caption: "Estate street view",
      },
      {
        src: "/fidelis-court/Sunlit Building Under Construction.png",
        caption: "Terrace block progress",
      },
    ],
  },
];

interface FidelisHomesSectionProps {
  onReserveUnit?: (unitTitle: string) => void;
}

export const FidelisHomesSection: React.FC<FidelisHomesSectionProps> = ({
  onReserveUnit,
}) => {
  const getSiteImage = useSiteImageResolver();
  const getSiteImageCaption = useSiteImageCaptionResolver();
  const [activeGallery, setActiveGallery] = React.useState<{
    unitIndex: number;
    photoIndex: number;
  } | null>(null);

  const openGallery = (unitIndex: number, photoIndex = 0) => {
    setActiveGallery({ unitIndex, photoIndex });
  };

  const closeGallery = () => {
    setActiveGallery(null);
  };

  const handleNextPhoto = React.useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (!activeGallery) return;
      const unit = FIDELIS_UNITS[activeGallery.unitIndex];
      setActiveGallery({
        unitIndex: activeGallery.unitIndex,
        photoIndex: (activeGallery.photoIndex + 1) % unit.galleryImages.length,
      });
    },
    [activeGallery]
  );

  const handlePrevPhoto = React.useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (!activeGallery) return;
      const unit = FIDELIS_UNITS[activeGallery.unitIndex];
      setActiveGallery({
        unitIndex: activeGallery.unitIndex,
        photoIndex:
          (activeGallery.photoIndex - 1 + unit.galleryImages.length) %
          unit.galleryImages.length,
      });
    },
    [activeGallery]
  );

  // Keyboard navigation & body scroll lock
  React.useEffect(() => {
    if (!activeGallery) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeGallery();
      } else if (e.key === "ArrowRight") {
        handleNextPhoto();
      } else if (e.key === "ArrowLeft") {
        handlePrevPhoto();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeGallery, handleNextPhoto, handlePrevPhoto]);

  const handleReserve = (unit: UnitModel) => {
    if (onReserveUnit) {
      onReserveUnit(unit.title);
      return;
    }
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const activeUnit =
    activeGallery !== null ? FIDELIS_UNITS[activeGallery.unitIndex] : null;
  const activePhoto =
    activeUnit !== null && activeGallery !== null
      ? activeUnit.galleryImages[activeGallery.photoIndex]
      : null;

  return (
    <section
      id="homes"
      className="w-full bg-[#FAFCFE] py-14 sm:py-20 border-b border-zinc-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00ABF0] block">
              CHOOSE YOUR HOME
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900">
              Homes at Fidelis Court
            </h2>
          </div>

          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-[#00ABF0] hover:text-[#00ABF0]/80 transition-colors group cursor-pointer self-start sm:self-auto"
          >
            <span>Pricing &amp; payment plan</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3 Unit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {FIDELIS_UNITS.map((unit, idx) => (
            <div
              key={unit.id}
              className="bg-white rounded-3xl overflow-hidden border border-zinc-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image Container */}
              <div
                className="relative w-full aspect-[4/3] overflow-hidden bg-zinc-100 cursor-pointer"
                onClick={() => openGallery(idx, 0)}
              >
                <Image
                  src={getSiteImage(unit.mainImage)}
                  alt={unit.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                {/* Gallery Count Pill Badge */}
                <div
                  className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-bold text-zinc-800 shadow-md border border-white/60 hover:bg-white transition-colors"
                  title="View photo gallery"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-zinc-600" />
                  <Images className="w-3.5 h-3.5 text-[#00ABF0]" />
                  <span>{unit.galleryImages.length}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between gap-6">
                <div className="space-y-1">
                  <span className="text-[11px] sm:text-xs font-medium text-zinc-500 tracking-wide block">
                    Actual site photos · Shared project concepts
                  </span>
                  <h3 className="text-xl sm:text-[22px] font-bold text-zinc-900 tracking-tight">
                    {unit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-500 leading-snug">
                    {unit.subtitle}
                  </p>

                  <div className="pt-3">
                    <p className="text-3xl sm:text-[34px] font-extrabold tracking-tight text-[#00ABF0]">
                      {unit.price}
                    </p>
                    <p className="text-xs text-zinc-500 font-medium mt-1">
                      Basic price · {unit.unitsCount} units in the development
                    </p>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => openGallery(idx, 0)}
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-2xl border border-zinc-200 bg-white hover:border-[#00ABF0] hover:text-[#00ABF0] text-zinc-700 text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
                  >
                    <Images className="w-4 h-4 shrink-0 text-[#00ABF0]" />
                    <span>View gallery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReserve(unit)}
                    className="flex items-center justify-center px-3 sm:px-4 py-2.5 rounded-2xl bg-[#0754C6] hover:brightness-90 active:brightness-75 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#0754C6]/25 cursor-pointer"
                  >
                    <span>Reserve a unit</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal matching exact user design */}
      {activeGallery && activeUnit && activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={closeGallery}
        >
          <div
            className="relative w-full max-w-4xl bg-white rounded-3xl p-5 sm:p-7 sm:pb-8 shadow-2xl border border-slate-100 flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Title + Price + Close */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 max-w-2xl pr-4">
                <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {activeUnit.title} · {activeUnit.price}
                </h3>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={closeGallery}
                className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Main Image Viewport with soft light blue border frame */}
            <div className="mt-4 sm:mt-5 relative w-full aspect-[16/10] sm:aspect-[16/9.5] rounded-2xl overflow-hidden bg-[#eaf2fc] border border-sky-100/80">
              <Image
                src={getSiteImage(activePhoto.src)}
                alt={getSiteImageCaption(activePhoto.src, activePhoto.caption)}
                fill
                sizes="(max-width: 1024px) 100vw, 920px"
                className="object-cover"
                priority
              />

              {/* Prev Button */}
              <button
                type="button"
                onClick={handlePrevPhoto}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-slate-700 shadow-md flex items-center justify-center transition-all hover:scale-105 cursor-pointer z-10 border border-slate-100"
                aria-label="Previous photo"
              >
                <ArrowLeft className="w-4 h-4 text-slate-700" />
              </button>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNextPhoto}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-slate-700 shadow-md flex items-center justify-center transition-all hover:scale-105 cursor-pointer z-10 border border-slate-100"
                aria-label="Next photo"
              >
                <ArrowRight className="w-4 h-4 text-slate-700" />
              </button>
            </div>

            {/* Counter & Caption Text */}
            <p className="text-xs sm:text-sm font-medium text-slate-600 mt-4 text-center">
              {activeGallery.photoIndex + 1} / {activeUnit.galleryImages.length}{" "}
              · {getSiteImageCaption(activePhoto.src, activePhoto.caption)}
            </p>

            {/* Thumbnails Row */}
            <div className="flex items-center justify-center gap-2.5 sm:gap-3 mt-3">
              {activeUnit.galleryImages.map((img, pIdx) => {
                const isActive = activeGallery.photoIndex === pIdx;
                return (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() =>
                      setActiveGallery({
                        unitIndex: activeGallery.unitIndex,
                        photoIndex: pIdx,
                      })
                    }
                    className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${isActive
                      ? "border-[#00ABF0] ring-2 ring-[#00ABF0]/30 scale-105"
                      : "border-slate-200 opacity-60 hover:opacity-100"
                      }`}
                  >
                    <Image
                      src={getSiteImage(img.src)}
                      alt={getSiteImageCaption(img.src, img.caption)}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
