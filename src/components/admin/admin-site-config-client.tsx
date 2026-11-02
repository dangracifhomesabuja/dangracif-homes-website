"use client";

import * as React from "react";
import {
  Building2,
  Phone,
  BarChart3,
  CalendarCheck,
  Save,
  Loader2,
  Youtube,
  Clock,
  Shield,
  Layers,
  MapPin,
  Mail,
  MessageSquare,
  Images,
  FileText,
  ListChecks,
  Plus,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { saveMultipleSiteConfigs } from "@/app/actions/admin-content";
import { SITE_IMAGE_GROUPS } from "@/constants/site-images";
import {
  DEFAULT_FACILITIES,
  FACILITY_ICON_OPTIONS,
  type Facility,
  normalizeFacilities,
} from "@/constants/facilities";
import { CustomSelect } from "@/components/ui/custom-select";
import { ImageUploader } from "./ui/image-uploader";
import { DocumentUploader } from "./ui/document-uploader";
import { ConfirmModal } from "./ui/confirm-modal";
import {
  DatePicker,
  formatDatePickerValue,
  parseDatePickerValue,
} from "@/components/ui/date-picker";

interface AdminSiteConfigClientProps {
  initialConfigs: Record<string, unknown>;
  initialTab?: string;
}

function getConfigGroup(
  configs: Record<string, unknown>,
  key: string
): Record<string, string | boolean> | undefined {
  const value = configs[key];
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  const group: Record<string, string | boolean> = {};
  for (const [field, fieldValue] of Object.entries(value)) {
    if (typeof fieldValue === "string" || typeof fieldValue === "boolean") {
      group[field] = fieldValue;
    }
  }
  return group;
}

function getString(
  config: Record<string, string | boolean> | undefined,
  key: string,
  fallback: string
) {
  const value = config?.[key];
  return typeof value === "string" ? value : fallback;
}

const FACILITY_ICON_SELECT_OPTIONS = FACILITY_ICON_OPTIONS.map(
  ({ value, label }) => ({ value, label })
);

export function AdminSiteConfigClient({
  initialConfigs,
  initialTab,
}: AdminSiteConfigClientProps) {
  const [activeTab, setActiveTab] = React.useState<
    "estate" | "stats" | "contact" | "open_house" | "facilities" | "images"
  >(
    initialTab === "images" || initialTab === "facilities"
      ? initialTab
      : "estate"
  );
  const [isSaving, setIsSaving] = React.useState(false);
  const [facilities, setFacilities] = React.useState<Facility[]>(
    () =>
      normalizeFacilities(initialConfigs.facilities) ??
      DEFAULT_FACILITIES.map((facility) => ({ ...facility }))
  );
  const [deleteTarget, setDeleteTarget] = React.useState<{
    index: number;
    label: string;
  } | null>(null);
  const shouldScrollToNewFacility = React.useRef(false);
  const newFacilityInputRef = React.useRef<HTMLInputElement>(null);
  const imageConfig = getConfigGroup(initialConfigs, "site_images");
  const [siteImages, setSiteImages] = React.useState<Record<string, string>>(
    () => {
      const images: Record<string, string> = {};
      for (const [key, value] of Object.entries(imageConfig || {})) {
        if (typeof value === "string") images[key] = value;
      }
      return images;
    }
  );
  const [brochureUrl, setBrochureUrl] = React.useState(
    typeof initialConfigs.brochure_url === "string"
      ? initialConfigs.brochure_url
      : ""
  );
  const estateConfig = getConfigGroup(initialConfigs, "estate");
  const statsConfig = getConfigGroup(initialConfigs, "stats");
  const contactConfig = getConfigGroup(initialConfigs, "contact");
  const openHouseConfig = getConfigGroup(initialConfigs, "open_house");

  // Estate settings
  const [estate, setEstate] = React.useState({
    name: getString(estateConfig, "name", "Fidelis Court"),
    address: getString(
      estateConfig,
      "address",
      "21, Josephat Mojeckwu Avenue, Kubwa F01, Abuja, FCT, Nigeria"
    ),
    description: getString(
      estateConfig,
      "description",
      "A gated residential community on approximately 9,900 sqm."
    ),
    deliveryDate: getString(
      estateConfig,
      "deliveryDate",
      "December 2027"
    ),
    youtubeUrl: getString(
      estateConfig,
      "youtubeUrl",
      "https://youtube.com"
    ),
  });

  // Stats settings
  const [stats, setStats] = React.useState({
    units: getString(statsConfig, "units", "88"),
    sqm: getString(statsConfig, "sqm", "9,900"),
    months: getString(statsConfig, "months", "14"),
    security: getString(statsConfig, "security", "24/7"),
  });

  // Contact settings
  const [contact, setContact] = React.useState({
    phone: getString(contactConfig, "phone", "+234 813 318 7860"),
    email: getString(
      contactConfig,
      "email",
      "sales@dangracifhomes.com"
    ),
    whatsapp: getString(contactConfig, "whatsapp", "2348133187860"),
    inspectionHours: getString(
      contactConfig,
      "inspectionHours",
      "Inspections hold Monday – Saturday, 9am – 5pm."
    ),
  });

  // Open House settings
  const [openHouse, setOpenHouse] = React.useState({
    enabled:
      typeof openHouseConfig?.enabled === "boolean"
        ? openHouseConfig.enabled
        : true,
    status: getString(openHouseConfig, "status", "Ongoing Event"),
    headline: getString(
      openHouseConfig,
      "headline",
      "Fidelis Court Open House"
    ),
    description: getString(
      openHouseConfig,
      "description",
      "Visit the estate, meet our sales team and explore your next home."
    ),
  });

  React.useEffect(() => {
    if (!shouldScrollToNewFacility.current) return;

    shouldScrollToNewFacility.current = false;
    requestAnimationFrame(() => {
      newFacilityInputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      newFacilityInputRef.current?.focus({ preventScroll: true });
    });
  }, [facilities.length]);

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveMultipleSiteConfigs({
        estate,
        stats,
        contact,
        open_house: openHouse,
        facilities,
        site_images: siteImages,
        brochure_url: brochureUrl,
      });
      toast.success("Site changes saved.");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to update configuration"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "estate", label: "Estate Info", icon: Building2 },
    { id: "stats", label: "Key Metrics", icon: BarChart3 },
    { id: "contact", label: "Contact & Hours", icon: Phone },
    { id: "open_house", label: "Open House Banner", icon: CalendarCheck },
    { id: "facilities", label: "Facilities & Services", icon: ListChecks },
    { id: "images", label: "Site Images", icon: Images },
  ] as const;

  return (
    <form onSubmit={handleSaveAll} className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          Save your changes to publish them on the website.
        </p>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0754C6] hover:bg-[#0648AB] text-white text-xs font-bold tracking-wide shadow-xs transition-all cursor-pointer disabled:opacity-60 self-start sm:self-center"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSaving ? "Saving..." : "Save changes"}</span>
        </button>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${isActive
                  ? "bg-[#0754C6] text-white shadow-2xs"
                  : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/70"
                }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ESTATE INFO */}
      {activeTab === "estate" && (
        <div className="bg-white rounded-lg border border-slate-200/80 shadow-2xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Estate Identity & Specifications
              </h3>
              <p className="text-xs text-slate-500">
                Primary name, physical location, and presentation details
              </p>
            </div>
            <Building2 className="w-5 h-5 text-slate-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Estate Brand Name
              </label>
              <input
                type="text"
                value={estate.name}
                onChange={(e) =>
                  setEstate((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20 focus:border-[#0754C6] focus:bg-white"
              />
            </div>

            <div>
              <DatePicker
                label="Target Handover / Delivery Date"
                value={parseDatePickerValue(estate.deliveryDate)}
                onChange={(date) =>
                  setEstate((prev) => ({
                    ...prev,
                    deliveryDate: formatDatePickerValue(date),
                  }))
                }
                placeholder="Select a delivery date"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Physical Location & Address
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={estate.address}
                onChange={(e) =>
                  setEstate((prev) => ({ ...prev, address: e.target.value }))
                }
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20 focus:border-[#0754C6] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              YouTube Video Tour / Walkthrough Link
            </label>
            <div className="relative">
              <Youtube className="w-4 h-4 text-red-500 absolute left-3.5 top-3" />
              <input
                type="url"
                value={estate.youtubeUrl}
                onChange={(e) =>
                  setEstate((prev) => ({ ...prev, youtubeUrl: e.target.value }))
                }
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20 focus:border-[#0754C6] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Estate Overview Description
            </label>
            <textarea
              rows={3}
              value={estate.description}
              onChange={(e) =>
                setEstate((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20 focus:border-[#0754C6] focus:bg-white resize-y"
            />
          </div>
        </div>
      )}

      {/* TAB 2: KEY METRICS */}
      {activeTab === "stats" && (
        <div className="bg-white rounded-lg border border-slate-200/80 shadow-2xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Key Performance Metrics & Stats
              </h3>
              <p className="text-xs text-slate-500">
                Displayed in the bold metric strip on the homepage
              </p>
            </div>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Total Units</span>
                <Layers className="w-4 h-4 text-[#00ABF0]" />
              </div>
              <input
                type="text"
                value={stats.units}
                onChange={(e) =>
                  setStats((prev) => ({ ...prev, units: e.target.value }))
                }
                placeholder="88"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-bold text-slate-900 focus:outline-hidden focus:border-[#0754C6]"
              />
              <p className="text-[10px] text-slate-400">Total residential units planned</p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Land Footprint</span>
                <MapPin className="w-4 h-4 text-[#00ABF0]" />
              </div>
              <input
                type="text"
                value={stats.sqm}
                onChange={(e) =>
                  setStats((prev) => ({ ...prev, sqm: e.target.value }))
                }
                placeholder="9,900"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-bold text-slate-900 focus:outline-hidden focus:border-[#0754C6]"
              />
              <p className="text-[10px] text-slate-400">Total sqm estate area</p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Timeline Months</span>
                <Clock className="w-4 h-4 text-[#00ABF0]" />
              </div>
              <input
                type="text"
                value={stats.months}
                onChange={(e) =>
                  setStats((prev) => ({ ...prev, months: e.target.value }))
                }
                placeholder="14"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-bold text-slate-900 focus:outline-hidden focus:border-[#0754C6]"
              />
              <p className="text-[10px] text-slate-400">Construction span in months</p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Security Guard</span>
                <Shield className="w-4 h-4 text-[#00ABF0]" />
              </div>
              <input
                type="text"
                value={stats.security}
                onChange={(e) =>
                  setStats((prev) => ({ ...prev, security: e.target.value }))
                }
                placeholder="24/7"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-bold text-slate-900 focus:outline-hidden focus:border-[#0754C6]"
              />
              <p className="text-[10px] text-slate-400">Surveillance & gate security</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONTACT & HOURS */}
      {activeTab === "contact" && (
        <div className="bg-white rounded-lg border border-slate-200/80 shadow-2xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Official Channels & Operating Hours
              </h3>
              <p className="text-xs text-slate-500">
                Channels utilized across forms, footers, and direct click-to-chat links
              </p>
            </div>
            <Phone className="w-5 h-5 text-slate-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Official Inquiries Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={contact.phone}
                  onChange={(e) =>
                    setContact((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20 focus:border-[#0754C6] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Official Sales Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) =>
                    setContact((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20 focus:border-[#0754C6] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                WhatsApp Direct Number (Digits only with country code)
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={contact.whatsapp}
                  onChange={(e) =>
                    setContact((prev) => ({ ...prev, whatsapp: e.target.value }))
                  }
                  placeholder="2348000000000"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20 focus:border-[#0754C6] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Site Inspection Hours Note
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={contact.inspectionHours}
                  onChange={(e) =>
                    setContact((prev) => ({
                      ...prev,
                      inspectionHours: e.target.value,
                    }))
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20 focus:border-[#0754C6] focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: OPEN HOUSE BANNER */}
      {activeTab === "open_house" && (
        <div className="bg-white rounded-lg border border-slate-200/80 shadow-2xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Open House Announcement Banner
              </h3>
              <p className="text-xs text-slate-500">
                Controls the prominent event ribbon displayed on the top of the website
              </p>
            </div>
            <CalendarCheck className="w-5 h-5 text-slate-400" />
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900">
                Enable Open House Banner
              </p>
              <p className="text-[11px] text-slate-500">
                When activated, visitors will see the announcement and quick RSVP options
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={openHouse.enabled}
                onChange={(e) =>
                  setOpenHouse((prev) => ({ ...prev, enabled: e.target.checked }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0754C6]" />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Badge Status Text
              </label>
              <input
                type="text"
                value={openHouse.status}
                onChange={(e) =>
                  setOpenHouse((prev) => ({ ...prev, status: e.target.value }))
                }
                placeholder="Ongoing Event or Scheduled for Saturday"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20 focus:border-[#0754C6] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Event Headline
              </label>
              <input
                type="text"
                value={openHouse.headline}
                onChange={(e) =>
                  setOpenHouse((prev) => ({ ...prev, headline: e.target.value }))
                }
                placeholder="Fidelis Court Open House"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20 focus:border-[#0754C6] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Event Description / Subtitle
            </label>
            <textarea
              rows={2}
              value={openHouse.description}
              onChange={(e) =>
                setOpenHouse((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20 focus:border-[#0754C6] focus:bg-white resize-none"
            />
          </div>

          {/* Live Preview Box */}
          <div className="pt-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Banner Appearance Preview
            </p>
            <div className="p-4 rounded-lg bg-gradient-to-r from-[#0754C6] to-[#04337a] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div>
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white mb-1">
                  {openHouse.status || "Special Event"}
                </span>
                <p className="text-xs font-bold">{openHouse.headline}</p>
                <p className="text-[11px] text-white/80">{openHouse.description}</p>
              </div>
              <span className="px-3 py-1.5 rounded-md bg-white text-[#00ABF0] text-xs font-bold self-start sm:self-center shadow-xs">
                RSVP Now
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "facilities" && (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Fidelis Court Facilities &amp; Services
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Add, edit, remove, and choose icons for the items shown on the Fidelis Court page.
              </p>
            </div>
            <button
              type="button"
              disabled={facilities.length >= 100}
              onClick={() => {
                shouldScrollToNewFacility.current = true;
                setFacilities((current) => [
                  ...current,
                  { icon: "Building2", label: "" },
                ]);
              }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#0754C6] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#0648AB] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Add facility
            </button>
          </div>

          <div className="space-y-3">
            {facilities.map((facility, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200/80 bg-white p-4 sm:grid-cols-[minmax(0,1fr)_12rem_auto] sm:items-center"
              >
                <input
                  ref={
                    index === facilities.length - 1
                      ? newFacilityInputRef
                      : undefined
                  }
                  type="text"
                  value={facility.label}
                  onChange={(event) =>
                    setFacilities((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, label: event.target.value }
                          : item
                      )
                    )
                  }
                  maxLength={120}
                  aria-label={`Facility ${index + 1} name`}
                  placeholder="Facility or service name"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium focus:border-[#0754C6] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20"
                />
                <CustomSelect
                  value={facility.icon}
                  onChange={(iconValue) => {
                    const icon = FACILITY_ICON_OPTIONS.find(
                      (option) => option.value === iconValue
                    )?.value;
                    if (!icon) return;
                    setFacilities((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, icon } : item
                      )
                    );
                  }}
                  options={FACILITY_ICON_SELECT_OPTIONS}
                  className="min-w-0"
                  triggerClassName="h-10 rounded-lg border-slate-200 bg-slate-50 px-3.5 text-xs"
                />
                <button
                  type="button"
                  onClick={() =>
                    setDeleteTarget({ index, label: facility.label })
                  }
                  aria-label={`Remove facility ${index + 1}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-100 px-3 py-2.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sm:hidden">Remove</span>
                </button>
              </div>
            ))}
            {facilities.length === 0 && (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                No facilities listed. Add one to show it on the Fidelis Court page.
              </div>
            )}
          </div>
        </section>
      )}

      {activeTab === "images" && (
        <section className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="mb-4">
              <h3 className="flex items-center gap-2 font-semibold text-slate-900">
                <FileText aria-hidden="true" className="h-4 w-4" />
                Fidelis Court brochure
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Upload a PDF to Cloudinary. Save changes to publish it on the brochure download button.
              </p>
            </div>
            <DocumentUploader value={brochureUrl} onChange={setBrochureUrl} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">Website images</h3>
            <p className="mt-1 text-sm text-slate-500">
              Upload to Cloudinary or paste a URL. Save changes to publish.
            </p>
          </div>

          {SITE_IMAGE_GROUPS.map((group, groupIndex) => (
            <details
              key={group.label}
              open={groupIndex === 0}
              className="rounded-lg border border-slate-200 bg-white"
            >
              <summary className="cursor-pointer px-4 py-3 font-medium text-slate-900">
                {group.label}
              </summary>
              <div className="grid gap-4 border-t border-slate-100 p-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.images.map((image) => (
                  <ImageUploader
                    key={image.src}
                    label={image.label}
                    value={siteImages[image.src] || image.src}
                    folder="site-images"
                    onChange={(url) =>
                      setSiteImages((current) => {
                        const next = { ...current };
                        if (url && url !== image.src) {
                          next[image.src] = url;
                        } else {
                          delete next[image.src];
                        }
                        return next;
                      })
                    }
                  />
                ))}
              </div>
            </details>
          ))}
        </section>
      )}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          setFacilities((current) =>
            current.filter((_, index) => index !== deleteTarget.index)
          );
          setDeleteTarget(null);
        }}
        title="Delete Facility"
        description="Are you sure you want to remove this facility from the Fidelis Court page?"
        itemName={deleteTarget?.label || "Untitled facility"}
      />
    </form>
  );
}
