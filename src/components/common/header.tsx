"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "@/constants/navigation";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onBookInspectionClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBookInspectionClick }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = React.useState(
    pathname?.startsWith("/other-projects") ?? false
  );

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile nav on route change
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close mobile nav on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleBookInspection = () => {
    setIsOpen(false);
    if (onBookInspectionClick) {
      onBookInspectionClick();
    } else {
      router.push("/book-inspection");
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        isOpen
          ? "bg-white border-b border-zinc-200 shadow-sm"
          : isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-zinc-200/60 shadow-xs"
          : "bg-white border-b border-zinc-200/80"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 h-20 sm:h-22 lg:h-24 flex items-center justify-between">
        {/* Brand Logo */}
        <Logo />

        {/* Desktop Nav + CTA */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-7">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === pathname ||
                (item.href.startsWith("/") && pathname?.startsWith(item.href));
              if (item.href === "/about") {
                return (
                  <div key={item.label} className="group relative py-3">
                    <Link
                      href={item.href}
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-[#00ABF0]",
                        isActive || pathname?.startsWith("/other-projects")
                          ? "text-[#00ABF0] font-semibold"
                          : "text-zinc-700"
                      )}
                    >
                      <span className="inline-flex items-center gap-1">
                        {item.label}
                        <ChevronDown
                          aria-hidden="true"
                          className="h-4 w-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
                        />
                      </span>
                    </Link>
                    <div className="invisible absolute left-0 top-full z-50 min-w-44 translate-y-1 rounded-xl border border-zinc-200 bg-white p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      <Link
                        href="/other-projects"
                        className={cn(
                          "block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-50 hover:text-[#00ABF0]",
                          pathname?.startsWith("/other-projects")
                            ? "font-semibold text-[#00ABF0]"
                            : "text-zinc-700"
                        )}
                      >
                        Other Projects
                      </Link>
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-[#00ABF0]",
                    isActive
                      ? "text-[#00ABF0] font-semibold"
                      : "text-zinc-700",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Button
            variant="primary"
            size="md"
            onClick={handleBookInspection}
          >
            Book Inspection
          </Button>
        </div>

        {/* Mobile Hamburger / Close Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 bg-white text-zinc-700 hover:bg-zinc-50 active:bg-zinc-100 transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0754C6]/20 cursor-pointer"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X className="w-5 h-5 text-zinc-700" />
          ) : (
            <Menu className="w-5 h-5 text-zinc-700" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-zinc-100 bg-white"
          >
            <div className="px-5 sm:px-6 pt-4 pb-7 flex flex-col">
              <nav className="flex flex-col gap-4">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    item.href === pathname ||
                    (item.href !== "/" && pathname?.startsWith(item.href));
                  if (item.href === "/about") {
                    return (
                      <div key={item.label}>
                        <div className="flex items-center justify-between">
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "text-[17px] font-medium tracking-tight py-1",
                              isActive || pathname?.startsWith("/other-projects")
                                ? "text-[#00ABF0]"
                                : "text-zinc-900 hover:text-[#00ABF0]"
                            )}
                          >
                            {item.label}
                          </Link>
                          <button
                            type="button"
                            onClick={() => setMobileAboutOpen((open) => !open)}
                            className="p-2 text-zinc-700"
                            aria-label={
                              mobileAboutOpen
                                ? "Hide Other Projects link"
                                : "Show Other Projects link"
                            }
                            aria-expanded={mobileAboutOpen}
                          >
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform",
                                mobileAboutOpen && "rotate-180"
                              )}
                            />
                          </button>
                        </div>
                        {mobileAboutOpen && (
                          <Link
                            href="/other-projects"
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "block py-2 pl-4 text-sm font-medium",
                              pathname?.startsWith("/other-projects")
                                ? "text-[#00ABF0]"
                                : "text-zinc-600 hover:text-[#00ABF0]"
                            )}
                          >
                            Other Projects
                          </Link>
                        )}
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-[17px] font-medium tracking-tight py-1",
                        isActive
                          ? "text-[#00ABF0]"
                          : "text-zinc-900 hover:text-[#00ABF0]",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 pt-1">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full text-base font-semibold rounded-full h-12 shadow-sm"
                  onClick={handleBookInspection}
                >
                  Book Inspection
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
