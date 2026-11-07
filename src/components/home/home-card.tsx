"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Images, Maximize2, X } from "lucide-react";
import { HomeModel } from "@/types";
import {
  useSiteImageCaptionResolver,
  useSiteImageResolver,
} from "@/components/common/site-images-provider";

interface HomeCardProps {
  home: HomeModel;
}

export const HomeCard: React.FC<HomeCardProps> = ({ home }) => {
  const getSiteImage = useSiteImageResolver();
  const getSiteImageCaption = useSiteImageCaptionResolver();
  const [activePhotoIndex, setActivePhotoIndex] = React.useState<number | null>(
    null
  );
  const showPhoto = React.useCallback(
    (index: number) => {
      setActivePhotoIndex(
        (index + home.galleryImages.length) % home.galleryImages.length
      );
    },
    [home.galleryImages.length]
  );
  const closeGallery = React.useCallback(() => setActivePhotoIndex(null), []);
  const activePhoto =
    activePhotoIndex === null ? null : home.galleryImages[activePhotoIndex];

  React.useEffect(() => {
    if (activePhotoIndex === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeGallery();
      if (event.key === "ArrowRight") showPhoto(activePhotoIndex + 1);
      if (event.key === "ArrowLeft") showPhoto(activePhotoIndex - 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePhotoIndex, closeGallery, home.galleryImages.length, showPhoto]);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      {/* Top Image Container */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={getSiteImage(home.imageSrc)}
          alt={home.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <button
          type="button"
          onClick={() => showPhoto(0)}
          className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-bold text-zinc-800 shadow-md border border-white/60 hover:bg-white transition-colors cursor-pointer"
          title="View photo gallery"
          aria-label={`View ${home.title} photo gallery`}
        >
          <Maximize2 className="w-3.5 h-3.5 text-zinc-600" />
          <Images className="w-3.5 h-3.5 text-[#00ABF0]" />
          <span>{home.galleryImages.length}</span>
        </button>
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-1 justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[13px] font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-500">
            {home.unitsCount} Units
          </span>
          <h3 className="text-[20px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {home.title}
          </h3>
          <p className="text-sm font-lg text-zinc-600 dark:text-zinc-600">
            {home.description}
          </p>
        </div>

        {/* Footer: Price & Enquire Pill */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-2xl font-bold tracking-tight text-[#00ABF0]">
            {home.price}
          </span>

          <Link
            href="/contact?tab=buy"
            className="px-5 py-2 rounded-full bg-[#EEF5FF] hover:bg-[#E0EEFF] text-[#00ABF0] font-semibold text-sm transition-colors cursor-pointer dark:bg-zinc-800 dark:hover:bg-zinc-700"
          >
            Enquire
          </Link>
        </div>
      </div>

      {activePhoto && activePhotoIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${home.title} photo gallery`}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={closeGallery}
        >
          <div
            className="relative w-full max-w-4xl bg-white rounded-3xl p-5 sm:p-7 sm:pb-8 shadow-2xl border border-slate-100 flex flex-col my-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 max-w-2xl pr-4">
                <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {home.title} · {home.price}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeGallery}
                className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="mt-4 sm:mt-5 relative w-full aspect-[16/10] sm:aspect-[16/9.5] rounded-2xl overflow-hidden bg-[#eaf2fc] border border-sky-100/80">
              <Image
                src={getSiteImage(activePhoto.src)}
                alt={getSiteImageCaption(activePhoto.src, activePhoto.caption)}
                fill
                sizes="(max-width: 1024px) 100vw, 920px"
                className="object-cover"
                priority
              />
              <button
                type="button"
                onClick={() => showPhoto(activePhotoIndex - 1)}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-slate-700 shadow-md flex items-center justify-center transition-all hover:scale-105 cursor-pointer z-10 border border-slate-100"
                aria-label="Previous photo"
              >
                <ArrowLeft className="w-4 h-4 text-slate-700" />
              </button>
              <button
                type="button"
                onClick={() => showPhoto(activePhotoIndex + 1)}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-slate-700 shadow-md flex items-center justify-center transition-all hover:scale-105 cursor-pointer z-10 border border-slate-100"
                aria-label="Next photo"
              >
                <ArrowRight className="w-4 h-4 text-slate-700" />
              </button>
            </div>

            <p className="text-xs sm:text-sm font-medium text-slate-600 mt-4 text-center">
              {activePhotoIndex + 1} / {home.galleryImages.length} ·{" "}
              {getSiteImageCaption(activePhoto.src, activePhoto.caption)}
            </p>

            <div className="flex items-center justify-center gap-2.5 sm:gap-3 mt-3">
              {home.galleryImages.map((photo, index) => (
                <button
                  key={photo.src}
                  type="button"
                  onClick={() => showPhoto(index)}
                  className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    index === activePhotoIndex
                      ? "border-[#00ABF0] ring-2 ring-[#00ABF0]/30 scale-105"
                      : "border-slate-200 opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`View photo ${index + 1}: ${getSiteImageCaption(
                    photo.src,
                    photo.caption
                  )}`}
                  aria-current={index === activePhotoIndex}
                >
                  <Image
                    src={getSiteImage(photo.src)}
                    alt={getSiteImageCaption(photo.src, photo.caption)}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
