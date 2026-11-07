"use client";

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
import { getPublicFooterConfig } from "@/app/actions/public-content";
import {
  DEFAULT_FOOTER_CONFIG,
  normalizeFooterConfig,
  type FooterSocialLink,
} from "@/constants/footer-config";

let footerConfigRequest: ReturnType<typeof getPublicFooterConfig> | undefined;

function getSocialIcon(platform: FooterSocialLink["platform"]) {
  if (platform === "instagram") return Instagram;
  if (platform === "youtube") return Youtube;
  if (platform === "facebook") return Facebook;
  return ExternalLink;
}

interface FooterProps {
  compact?: boolean;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ compact = false, className }) => {
  const [footer, setFooter] = React.useState(DEFAULT_FOOTER_CONFIG);

  React.useEffect(() => {
    let isMounted = true;
    footerConfigRequest ??= getPublicFooterConfig().finally(() => {
      footerConfigRequest = undefined;
    });
    footerConfigRequest
      .then((config) => {
        if (isMounted) setFooter(normalizeFooterConfig(config));
      })
      .catch((error: unknown) => {
        footerConfigRequest = undefined;
        console.warn("Could not load footer items:", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const officePhones = footer.officePhones.filter((phone) => phone.trim());
  const marketingPhones = footer.marketingPhones.filter((phone) => phone.trim());
  const socialLinks = footer.socialLinks.filter(
    (link) => link.label.trim() && link.href.trim()
  );

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
                  {footer.companyName}
                </h3>
                {footer.registrationNumber && (
                  <p className="text-[13px] font-medium leading-[18px] text-[#f0f6fc]">
                    {footer.registrationNumber}
                  </p>
                )}
              </div>
            </div>

            <p className="text-[14px] font-normal leading-[20px] text-[#f0f6fc] max-w-sm">
              Building beautiful, durable and thoughtfully designed communities in
              Abuja.
            </p>

            <div className="space-y-3 pt-1 text-[14px] font-normal leading-[20px] text-[#f0f6fc]">
              {/* Head Office Address */}
              {(footer.officeName || footer.officeAddress) && (
                <div className="flex items-start gap-2.5 text-[#f0f6fc]">
                  <MapPin className="h-4 w-4 text-[#f0f6fc] shrink-0 mt-0.5" />
                  <div>
                    {footer.officeName && (
                      <p className="text-[14px] font-normal leading-[20px] text-[#f0f6fc]">
                        {footer.officeName}
                      </p>
                    )}
                    {footer.officeAddress && (
                      <p className="text-[14px] font-normal leading-[20px] text-[#f0f6fc] mt-0.5">
                        {footer.officeAddress}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Fidelis Court Address — mobile only, after Dangracif address */}
              {(footer.projectName || footer.projectAddress) && (
                <div className="flex items-start gap-2.5 text-[#f0f6fc] sm:hidden">
                  <MapPin className="h-4 w-4 text-[#f0f6fc] shrink-0 mt-0.5" />
                  <div>
                    {footer.projectName && (
                      <p className="text-[14px] font-semibold leading-[20px] text-[#f0f6fc]">
                        {footer.projectName}
                      </p>
                    )}
                    {footer.projectAddress && (
                      <p className="text-[14px] font-normal leading-[20px] text-[#f0f6fc] mt-0.5">
                        {footer.projectAddress}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Marketed exclusively by — mobile only */}
              {marketingPhones.length > 0 && (
                <div className="sm:hidden">
                  <span className="text-[11px] font-bold text-[#f0f6fc]/60 uppercase tracking-wider block mb-1.5">
                    MARKETED EXCLUSIVELY BY
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
                    {marketingPhones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone.replace(/\s+/g, "")}`}
                        className="flex items-center gap-2.5 text-[14px] font-normal leading-[20px] text-[#f0f6fc] hover:text-white transition-colors"
                      >
                        <Phone className="h-4 w-4 shrink-0" />
                        <span>{phone}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Phone */}
              {officePhones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-2.5 text-[14px] font-normal leading-[20px] text-[#f0f6fc] hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4 text-[#f0f6fc] shrink-0" />
                  <span>{phone}</span>
                </a>
              ))}

              {/* Email */}
              {footer.email.trim() && (
                <a
                  href={`mailto:${footer.email.trim()}`}
                  className="flex items-center gap-2.5 text-[14px] font-normal leading-[20px] text-[#f0f6fc] hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 text-[#f0f6fc] shrink-0" />
                  <span>{footer.email}</span>
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Explore Links (1 of 5 columns) */}
          <div className="lg:col-span-1 space-y-3">
            <h4 className="text-[15px] sm:text-[16px] font-bold text-white tracking-wide mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-[14px] font-normal leading-[20px] text-[#f0f6fc]">
              <li><Link href="/fideliscourt" className="hover:text-white transition-colors block">Fidelis Court</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors block">Pricing &amp; Payment Plan</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors block">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors block">Blog</Link></li>
              <li><Link href="/become-an-agent" className="hover:text-white transition-colors block">Become an Agent</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors block">Careers</Link></li>
              <li><Link href="/contact?tab=buy" className="hover:text-white transition-colors block">Book / Reserve / Buy</Link></li>
            </ul>
          </div>

          {/* Col 3: Fidelis Court & Marketing Partner — desktop only (mobile content lives in col-1) */}
          <div className="lg:col-span-1 space-y-3 hidden sm:block">
            {footer.projectName && (
              <h4 className="text-[15px] sm:text-[16px] font-bold text-white tracking-wide mb-4">
                {footer.projectName}
              </h4>
            )}
            {footer.projectAddress && (
              <div className="flex items-start gap-2.5 text-[14px] font-normal leading-[20px] text-[#f0f6fc]">
                <MapPin className="h-4 w-4 text-[#f0f6fc] shrink-0 mt-0.5" />
                <p className="leading-[20px]">{footer.projectAddress}</p>
              </div>
            )}

            {/* Exclusive Marketing Partner */}
            {marketingPhones.length > 0 && (
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
                  {marketingPhones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s+/g, "")}`}
                      className="flex items-center gap-2.5 text-[14px] font-normal leading-[20px] text-[#f0f6fc] hover:text-white transition-colors"
                    >
                      <Phone className="h-4 w-4 shrink-0" />
                      <span>{phone}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Col 4: Follow Us (1 of 5 columns) */}
          <div className="lg:col-span-1 space-y-3">
            <h4 className="text-[15px] sm:text-[16px] font-bold text-white tracking-wide mb-4">
              Follow us
            </h4>
            <ul className="space-y-3 text-[14px] font-normal leading-[20px] text-[#f0f6fc]">
              {socialLinks.map((link, index) => {
                const Icon = getSocialIcon(link.platform);
                return (
                  <li key={`${link.href}-${index}`}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 hover:text-white transition-colors"
                    >
                      <Icon className="h-4 w-4 text-[#f0f6fc] shrink-0" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Full-width Divider & Bottom Copyright */}
      <div className="w-full border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-4 text-center">
          <p className="text-[11px] sm:text-[12px] font-medium leading-[20px] text-[#f0f6fc]">
            © {new Date().getFullYear()} {footer.companyName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
