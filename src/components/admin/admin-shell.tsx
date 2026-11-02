"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Home,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Building2,
  FileText,
  HelpCircle,
  CalendarDays,
  SlidersHorizontal,
} from "lucide-react";
import { adminLogoutAction } from "@/app/actions/admin-auth";
import { AdminSessionUser } from "@/lib/auth";
import { AdminInactivityTracker } from "./admin-inactivity-tracker";
import toast from "react-hot-toast";

interface AdminShellProps {
  user: AdminSessionUser;
  children: React.ReactNode;
}

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  // Close mobile sidebar on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await adminLogoutAction();
      toast.success("Signed out successfully");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("Failed to sign out");
      setIsLoggingOut(false);
    }
  };

  const navGroups = [
    {
      group: "Core Management",
      items: [
        {
          href: "/admin",
          label: "Overview",
          icon: LayoutDashboard,
          exact: true,
        },
        {
          href: "/admin/leads",
          label: "Leads & Inquiries",
          icon: Users,
          exact: false,
        },
        {
          href: "/admin/units",
          label: "Estate Inventory",
          icon: Home,
          exact: false,
        },
      ],
    },
    {
      group: "Website Content",
      items: [
        {
          href: "/admin/blog",
          label: "Blog & Insights",
          icon: FileText,
          exact: false,
        },
        {
          href: "/admin/faqs",
          label: "FAQs",
          icon: HelpCircle,
          exact: false,
        },
        {
          href: "/admin/timeline",
          label: "Construction Timeline",
          icon: CalendarDays,
          exact: false,
        },
        {
          href: "/admin/site-config",
          label: "Site Configuration",
          icon: SlidersHorizontal,
          exact: false,
        },
      ],
    },
    {
      group: "Account",
      items: [
        {
          href: "/admin/settings",
          label: "Portal Settings",
          icon: Settings,
          exact: false,
        },
      ],
    },
  ];

  const getPageTitle = () => {
    if (pathname === "/admin") return "Executive Overview";
    if (pathname.startsWith("/admin/leads")) return "Leads & Inquiries";
    if (pathname.startsWith("/admin/units")) return "Estate Inventory";
    if (pathname.startsWith("/admin/blog")) return "Blog & Articles";
    if (pathname.startsWith("/admin/faqs")) return "Frequently Asked Questions";
    if (pathname.startsWith("/admin/timeline")) return "Construction Timeline";
    if (pathname.startsWith("/admin/site-config")) return "Site Configuration";
    if (pathname.startsWith("/admin/settings")) return "Portal Settings";
    return "Admin Portal";
  };

  const getPageSubtitle = () => {
    if (pathname.startsWith("/admin/leads"))
      return "Review, follow up, and track status for all prospect submissions.";
    if (pathname.startsWith("/admin/units"))
      return "Configure unit counts, real-time availability, and pricing.";
    if (pathname.startsWith("/admin/blog"))
      return "Manage published articles, news, and market insights on the website.";
    if (pathname.startsWith("/admin/faqs"))
      return "Manage questions and answers displayed in the public FAQ section.";
    if (pathname.startsWith("/admin/timeline"))
      return "Update construction milestones and development phases for Fidelis Court.";
    if (pathname.startsWith("/admin/site-config"))
      return "Manage website details, section images, and Fidelis Court facilities.";
    if (pathname.startsWith("/admin/settings"))
      return "Manage executive credentials, security configuration, and preferences.";
    return "Real-time pipeline overview for Fidelis Court and customer inquiries.";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900 font-sans antialiased">
      <AdminInactivityTracker />
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Brand Header */}
        <div className="h-18 px-6 border-b border-slate-100 flex items-center justify-between">
          <Link href="/admin" className="relative h-12 w-36 block group select-none transition-transform duration-200 group-hover:scale-105">
            <Image
              src="/images/logo.png"
              alt="Dangracif Homes Limited"
              fill
              sizes="150px"
              className="object-contain"
              priority
            />
          </Link>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {group.group}
              </div>
              {group.items.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${isActive
                      ? "bg-[#0754C6]/10 text-[#00ABF0] font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 transition-colors ${isActive
                          ? "text-[#00ABF0]"
                          : "text-slate-400 group-hover:text-slate-600"
                          }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0754C6]" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Sidebar: User & Public Link */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-[#00ABF0] hover:bg-white border border-slate-200/60 bg-white/60 transition-all shadow-2xs group"
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00ABF0]" />
              <span>Public Website</span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#00ABF0]" />
          </Link>

          {/* User Profile Card */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#0754C6] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOPBAR HEADER */}
        {pathname === "/admin" ? (
          <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 sm:px-8 py-4 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md cursor-pointer shrink-0 mt-0.5"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Welcome back, {user.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Here&apos;s a quick look at your inquiries and units.
                </p>
              </div>
            </div>

            <div className="flex items-center self-start md:self-center shrink-0">
              <Link
                href="/admin/leads"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#0754C6] hover:bg-[#0648AB] text-white text-xs font-bold tracking-wide shadow-xs transition-all"
              >
                <Users className="w-4 h-4" />
                <span>View inquiries</span>
              </Link>
            </div>
          </header>
        ) : (
          <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md cursor-pointer shrink-0"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {getPageTitle()}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {getPageSubtitle()}
                </p>
              </div>
            </div>

           
          </header>
        )}

        {/* PAGE BODY */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
