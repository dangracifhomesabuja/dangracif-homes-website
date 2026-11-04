import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  brandColor?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center group select-none shrink-0 py-1", className)}
      aria-label="Dangracif Homes"
    >
      <div className="relative h-12 sm:h-13.5 lg:h-[76px] w-[120px] sm:w-[140px] lg:w-[180px] shrink-0">
        <Image
          src="/images/logo.png"
          alt="Dangracif Homes"
          fill
          sizes="(max-width: 640px) 120px, 180px"
          className="object-contain object-left transition-transform duration-200 group-hover:scale-105"
          priority
        />
      </div>
    </Link>
  );
};
