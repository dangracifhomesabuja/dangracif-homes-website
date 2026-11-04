import * as React from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Youtube,
  Facebook,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FooterProps {
  compact?: boolean;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ compact = false, className }) => {
  return (
    <footer
      className={cn(
        "w-full bg-[#07183a] text-[#f0f6fc]",
        className
      )}
    >
      {/* Main Grid Container */}
      <div
        className={cn(
          "max-w-7xl mx-auto px-6 sm:px-6 lg:px-8",
          compact ? "pt-8 sm:pt-10 pb-6 sm:pb-8" : "pt-12 sm:pt-14 pb-8 sm:pb-10"
        )}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8 items-start">
          {/* Col 1: Brand & Contact Info (takes 2 of 5 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              {/* Brand mobile */}
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <h3 className="text-[22px] sm:text-[24px] font-bold text-white tracking-tight">
                  Dangracif Homes
                </h3>
                <p className="text-[13px] font-medium leading-[18px] text-[#f0f6fc]">
                  RC-1896142
                </p>
              </div>
            </div>

            <p className="text-[14px] font-normal leading-[20px] text-[#f0f6fc] max-w-sm">
              Building beautiful, durable and thoughtfully designed communities in
              Abuja.
            </p>

            <div className="space-y-3 pt-1 text-[14px] font-normal leading-[20px] text-[#f0f6fc]">
              {/* Head Office Address */}
              <div className="flex items-start gap-2.5 text-[#f0f6fc]">
                <MapPin className="h-4 w-4 text-[#f0f6fc] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[14px] font-normal leading-[20px] text-[#f0f6fc]">
                    Dangracif Homes Limited
                  </p>
                  <p className="text-[14px] font-normal leading-[20px] text-[#f0f6fc] mt-0.5">
                    Suite B5, Bricks ‘N’ More Plaza, 6th Avenue, Gwarimpa, Abuja,
                    FCT, Nigeria
                  </p>
                </div>
              </div>

              {/* Fidelis Court Address — mobile only, after Dangracif address */}
              <div className="flex items-start gap-2.5 text-[#f0f6fc] sm:hidden">
                <MapPin className="h-4 w-4 text-[#f0f6fc] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[14px] font-semibold leading-[20px] text-[#f0f6fc]">
                    Fidelis Court
                  </p>
                  <p className="text-[14px] font-normal leading-[20px] text-[#f0f6fc] mt-0.5">
                    21, Josephat Mojeckwu Avenue, Kubwa F01, Abuja, FCT, Nigeria
                  </p>
                </div>
              </div>

              {/* Marketed exclusively by — mobile only */}
              <div className="sm:hidden">
                <span className="text-[11px] font-bold text-[#f0f6fc]/60 uppercase tracking-wider block mb-1.5">
                  MARKETED EXCLUSIVELY BY
                </span>
                <a
                  href="https://www.masterpiececapitalltd.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[14px] font-normal leading-[20px] text-[#f0f6fc] hover:text-white transition-colors group"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#f0f6fc] group-hover:text-white transition-colors shrink-0" />
                  <span>Masterpiece Capital</span>
                </a>
                <div className="mt-2 space-y-2">
                  <a
                    href="tel:+2348133187860"
                    className="flex items-center gap-2.5 text-[14px] font-normal leading-[20px] text-[#f0f6fc] hover:text-white transition-colors"
                  >
                    <Phone className="h-4 w-4 shrink-0" />
                    <span>+234 813 318 7860</span>
                  </a>
                  <a
                    href="tel:+2348138911937"
                    className="flex items-center gap-2.5 text-[14px] font-normal leading-[20px] text-[#f0f6fc] hover:text-white transition-colors"
                  >
                    <Phone className="h-4 w-4 shrink-0" />
                    <span>+234 813 891 1937</span>
                  </a>
                  <a
                    href="tel:+2347071322002"
                    className="flex items-center gap-2.5 text-[14px] font-normal leading-[20px] text-[#f0f6fc] hover:text-white transition-colors"
                  >
                    <Phone className="h-4 w-4 shrink-0" />
                    <span>+234 707 132 2002</span>
                  </a>
                </div>
              </div>

              {/* Phone */}
              <a
                href="tel:+2347066249077"
                className="flex items-center gap-2.5 text-[14px] font-normal leading-[20px] text-[#f0f6fc] hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 text-[#f0f6fc] shrink-0" />
                <span>+234 706 624 9077</span>
              </a>

              {/* Phone 3 */}
              <a
                href="tel:+2348059474405"
                className="flex items-center gap-2.5 text-[14px] font-normal leading-[20px] text-[#f0f6fc] hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 text-[#f0f6fc] shrink-0" />
                <span>+234 805 947 4405</span>
              </a>

              {/* Email */}
              <a
                href="mailto:info@dangracif.com"
                className="flex items-center gap-2.5 text-[14px] font-normal leading-[20px] text-[#f0f6fc] hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 text-[#f0f6fc] shrink-0" />
                <span>info@dangracif.com</span>
              </a>
            </div>
          </div>

          {/* Col 2: Explore Links (1 of 5 columns) */}
          <div className="lg:col-span-1 space-y-3">
            <h4 className="text-[15px] sm:text-[16px] font-bold text-white tracking-wide mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-[14px] font-normal leading-[20px] text-[#f0f6fc]">
              <li>
                <Link
                  href="/fideliscourt"
                  className="hover:text-white transition-colors block"
                >
                  Fidelis Court
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-white transition-colors block"
                >
                  Pricing &amp; Payment Plan
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-white transition-colors block"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/become-an-agent"
                  className="hover:text-white transition-colors block"
                >
                  Become an Agent
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-white transition-colors block"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/contact?tab=buy"
                  className="hover:text-white transition-colors block"
                >
                  Book / Reserve / Buy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Fidelis Court & Marketing Partner — desktop only (mobile content lives in col-1) */}
          <div className="lg:col-span-1 space-y-3 hidden sm:block">
            <h4 className="text-[15px] sm:text-[16px] font-bold text-white tracking-wide mb-4">
              Fidelis Court
            </h4>
            <div className="flex items-start gap-2.5 text-[14px] font-normal leading-[20px] text-[#f0f6fc]">
              <MapPin className="h-4 w-4 text-[#f0f6fc] shrink-0 mt-0.5" />
              <p className="leading-[20px]">
                21, Josephat Mojeckwu Avenue, Kubwa F01, Abuja, FCT, Nigeria
              </p>
            </div>

            {/* Exclusive Marketing Partner */}
            <div className="pt-5 sm:pt-6">
              <span className="text-[11px] font-bold text-[#f0f6fc]/60 uppercase tracking-wider block mb-2">
                EXCLUSIVE MARKETING FIRM
              </span>
              <a
                href="https://masterpiececapitalltd.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[14px] font-normal leading-[20px] text-[#f0f6fc] hover:text-white transition-colors group"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#f0f6fc] group-hover:text-white transition-colors shrink-0" />
                <span>Masterpiece Capital</span>
              </a>
              <div className="mt-2 space-y-2">
                <a
                  href="tel:+2348133187860"
                  className="flex items-center gap-2.5 text-[14px] font-normal leading-[20px] text-[#f0f6fc] hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>+234 813 318 7860</span>
                </a>
                <a
                  href="tel:+2348138911937"
                  className="flex items-center gap-2.5 text-[14px] font-normal leading-[20px] text-[#f0f6fc] hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>+234 813 891 1937</span>
                </a>
                <a
                  href="tel:+2347071322002"
                  className="flex items-center gap-2.5 text-[14px] font-normal leading-[20px] text-[#f0f6fc] hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>+234 707 132 2002</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Follow Us (1 of 5 columns) */}
          <div className="lg:col-span-1 space-y-3">
            <h4 className="text-[15px] sm:text-[16px] font-bold text-white tracking-wide mb-4">
              Follow us
            </h4>
            <ul className="space-y-3 text-[14px] font-normal leading-[20px] text-[#f0f6fc]">
              <li>
                <a
                  href="https://www.instagram.com/dangracifhomes?rpxt=dWxueWs1MXYzcnUy&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <Instagram className="h-4 w-4 text-[#f0f6fc] shrink-0" />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com/@dangracifhomesabuja?si=WeanGoaxK_SB5EAg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <Youtube className="h-4 w-4 text-[#f0f6fc] shrink-0" />
                  <span>YouTube</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/profile.php?id=61595924164485"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <Facebook className="h-4 w-4 text-[#f0f6fc] shrink-0" />
                  <span>Facebook</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Full-width Divider & Bottom Copyright */}
      <div className="w-full border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-4 text-center">
          <p className="text-[11px] sm:text-[12px] font-medium leading-[20px] text-[#f0f6fc]">
            © {new Date().getFullYear()} Dangracif Homes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
