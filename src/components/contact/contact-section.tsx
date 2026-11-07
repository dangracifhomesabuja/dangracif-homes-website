"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  Calendar,
  KeyRound,
  Building,
  Users,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import { UNIT_OPTIONS, ESTATE_CONTACT } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/ui/date-picker";
import { CustomSelect } from "@/components/ui/custom-select";
import { submitLeadInquiry } from "@/app/actions/admin-dashboard";

const PAYMENT_OPTIONS = [
  { value: "Outright payment", label: "Outright payment" },
  { value: "12-month payment plan", label: "12-month payment plan" },
];

type ContactTab = "inspection" | "reserve" | "buy" | "open-house";

const TABS: { id: ContactTab; label: string; icon: React.ElementType }[] = [
  { id: "inspection", label: "Book Inspection", icon: Calendar },
  { id: "reserve", label: "Reserve a Unit", icon: KeyRound },
  { id: "buy", label: "Buy Now", icon: Building },
  { id: "open-house", label: "Open House", icon: Users },
];

export const ContactSection: React.FC = () => {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as ContactTab | null;
  const validTabs: ContactTab[] = ["inspection", "reserve", "buy", "open-house"];
  const [activeTab, setActiveTab] = React.useState<ContactTab>(
    tabParam && validTabs.includes(tabParam) ? tabParam : "reserve"
  );

  // Sync tab if URL param changes (e.g. browser back/forward)
  React.useEffect(() => {
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabParam]);

  // Form states
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [unitType, setUnitType] = React.useState("2-bed");
  const [preferredDate, setPreferredDate] = React.useState("");
  const [numberOfUnits, setNumberOfUnits] = React.useState("1");
  const [paymentOption, setPaymentOption] = React.useState("Outright payment");
  const [attendees, setAttendees] = React.useState("1");
  const [message, setMessage] = React.useState("");

  const getActiveUnitLabel = () => {
    const found = UNIT_OPTIONS.find((u) => u.value === unitType);
    return found ? found.label : "2-Bedroom Apartment — ₦82,500,000";
  };

  const getSubmissionDetails = () => {
    switch (activeTab) {
      case "inspection":
        return {
          title: "Book Inspection",
          subtitle:
            "Choose a date and we'll confirm your visit to Fidelis Court, Kubwa F01.",
          subject: "Inspection Booking - Fidelis Court",
          summary: `Request: Book Inspection\nFull Name: ${fullName || "N/A"}\nPhone: ${phone || "N/A"}\nEmail: ${email || "N/A"}\nUnit: ${getActiveUnitLabel()}\nPreferred Date: ${preferredDate || "N/A"}\nMessage: ${message || "N/A"}`,
          btnWhatsApp: "Send via WhatsApp",
          btnEmail: "Send via Email",
        };
      case "reserve":
        return {
          title: "Reserve a Unit",
          subtitle: "Hold your preferred unit while you finalise.",
          subject: "Unit Reservation - Fidelis Court",
          summary: `Request: Reserve a Unit\nFull Name: ${fullName || "N/A"}\nPhone: ${phone || "N/A"}\nEmail: ${email || "N/A"}\nUnit: ${getActiveUnitLabel()}\nNumber of Units: ${numberOfUnits}\nMessage: ${message || "N/A"}`,
          btnWhatsApp: "Send via WhatsApp",
          btnEmail: "Send via Email",
        };
      case "buy":
        return {
          title: "Buy Now",
          subtitle: "Send a purchase demand to our sales team.",
          subject: "Purchase Demand - Fidelis Court",
          summary: `Request: Buy Now\nFull Name: ${fullName || "N/A"}\nPhone: ${phone || "N/A"}\nEmail: ${email || "N/A"}\nUnit: ${getActiveUnitLabel()}\nNumber of Units: ${numberOfUnits}\nPayment Option: ${paymentOption}\nMessage: ${message || "N/A"}`,
          btnWhatsApp: "Send via WhatsApp",
          btnEmail: "Send via Email",
        };
      case "open-house":
        return {
          title: "Open House",
          subtitle:
            "Register for our ongoing open house at Fidelis Court estate, Kubwa F01.",
          subject: "Open House Registration - Fidelis Court",
          summary: `Request: Open House Registration\nFull Name: ${fullName || "N/A"}\nPhone: ${phone || "N/A"}\nEmail: ${email || "N/A"}\nHome of Interest: ${getActiveUnitLabel()}\nAttendees: ${attendees}\nMessage: ${message || "N/A"}`,
          btnWhatsApp: "Register via WhatsApp",
          btnEmail: "Register via Email",
        };
    }
  };

  const details = getSubmissionDetails();

  const [submitting, setSubmitting] = React.useState<"whatsapp" | "email" | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const recordLeadInquiry = async () => {
    try {
      const res = await submitLeadInquiry({
        type: activeTab,
        fullName: fullName.trim() || "Website Visitor",
        phone: phone.trim() || "N/A",
        email: email.trim() || "N/A",
        unitType,
        numberOfUnits: parseInt(numberOfUnits, 10) || 1,
        paymentOption: activeTab === "buy" ? paymentOption : undefined,
        preferredDate: activeTab === "inspection" ? preferredDate : undefined,
        attendees: activeTab === "open-house" ? parseInt(attendees, 10) || 1 : undefined,
        message: message.trim() || undefined,
      });
      return res;
    } catch (err) {
      console.warn("Could not save inquiry to database:", err);
      return { success: false };
    }
  };

  const validateForm = () => {
    setErrorMsg(null);
    if (!fullName.trim()) {
      setErrorMsg("Please enter your full name.");
      return false;
    }
    if (!phone.trim() && !email.trim()) {
      setErrorMsg("Please provide either your phone number or email.");
      return false;
    }
    return true;
  };

  const handleWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submissionDetails = details;
    setSubmitting("whatsapp");
    setSuccessMsg("Saving your inquiry...");
    setErrorMsg(null);
    const result = await recordLeadInquiry();
    setSubmitting(null);
    if (result.success) {
      setFullName("");
      setPhone("");
      setEmail("");
      setUnitType("2-bed");
      setPreferredDate("");
      setNumberOfUnits("1");
      setPaymentOption("Outright payment");
      setAttendees("1");
      setMessage("");
      setSuccessMsg("Inquiry recorded successfully! Opening WhatsApp...");
    } else {
      setSuccessMsg(null);
      setErrorMsg("We couldn't save your inquiry. Your message will still open in WhatsApp; please try again if needed.");
    }

    const text = `Hello Dangracif Homes,\n\n${submissionDetails.summary}`;
    window.open(
      `https://wa.me/2348133187860?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submissionDetails = details;
    setSubmitting("email");
    setSuccessMsg("Saving your inquiry...");
    setErrorMsg(null);
    const result = await recordLeadInquiry();
    setSubmitting(null);
    if (result.success) {
      setFullName("");
      setPhone("");
      setEmail("");
      setUnitType("2-bed");
      setPreferredDate("");
      setNumberOfUnits("1");
      setPaymentOption("Outright payment");
      setAttendees("1");
      setMessage("");
      setSuccessMsg("Inquiry recorded successfully! Opening your email app...");
    } else {
      setSuccessMsg(null);
      setErrorMsg("We couldn't save your inquiry. Your message will still open in your email app; please try again if needed.");
    }

    window.location.href = `mailto:info@dangracif.com?subject=${encodeURIComponent(
      submissionDetails.subject
    )}&body=${encodeURIComponent(submissionDetails.summary)}`;
  };

  return (
    <section className="w-full bg-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          {/* Main Left Column (Form and Tabs) */}
          <div className="flex-1 min-w-0 space-y-6 w-full">
            {/* Header text */}
            <div className="space-y-2">
              <span className={`text-xs font-bold uppercase tracking-[0.2em] text-[#00ABF0]`}>
                GET IN TOUCH
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Let&apos;s get you home.
              </h1>
            </div>

            {/* Pill Tab Switcher — EXACT same width as the form */}
            <div className="w-full bg-[#EAF2FE] p-1.5 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-center text-sm font-semibold transition-all cursor-pointer",
                      isActive
                        ? "bg-white text-[#00ABF0] shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Form Card */}
            <div className="w-full bg-white rounded-3xl border border-slate-200/90 p-7 sm:p-10 shadow-sm">
              <div className="mb-7">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {details.title}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {details.subtitle}
                </p>
              </div>

              <form className="space-y-5">
                {/* Full name */}
                <div>
                  <label className="text-sm font-semibold text-slate-800 mb-1.5 block">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full rounded-xl border border-slate-200/90 px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#0754C6] focus:ring-1 focus:ring-[#0754C6] transition-colors"
                  />
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-800 mb-1.5 block">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234..."
                      className="w-full rounded-xl border border-slate-200/90 px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#0754C6] focus:ring-1 focus:ring-[#0754C6] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-800 mb-1.5 block">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full rounded-xl border border-slate-200/90 px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#0754C6] focus:ring-1 focus:ring-[#0754C6] transition-colors"
                    />
                  </div>
                </div>

                {/* TAB 1: Book Inspection (Unit Type & Date) */}
                {activeTab === "inspection" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-800 mb-1.5 block">
                        Unit type
                      </label>
                      <CustomSelect
                        value={unitType}
                        onChange={setUnitType}
                        options={UNIT_OPTIONS}
                        placeholder="Select a unit"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-800 mb-1.5 block">
                        Preferred inspection date
                      </label>
                      <DatePicker
                        value={preferredDate}
                        onChange={setPreferredDate}
                        placeholder="Pick a date"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 2: Reserve a Unit (Unit Type & Number of Units) */}
                {activeTab === "reserve" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-800 mb-1.5 block">
                        Unit type
                      </label>
                      <CustomSelect
                        value={unitType}
                        onChange={setUnitType}
                        options={UNIT_OPTIONS}
                        placeholder="Select a unit"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-800 mb-1.5 block">
                        Number of units
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={numberOfUnits}
                        onChange={(e) => setNumberOfUnits(e.target.value)}
                        className="w-full rounded-xl border border-slate-200/90 px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#0754C6] focus:ring-1 focus:ring-[#0754C6] transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 3: Buy Now (Unit Type & Number of Units + Payment Option) */}
                {activeTab === "buy" && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-slate-800 mb-1.5 block">
                          Unit type
                        </label>
                        <CustomSelect
                          value={unitType}
                          onChange={setUnitType}
                          options={UNIT_OPTIONS}
                          placeholder="Select a unit"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-slate-800 mb-1.5 block">
                          Number of units
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={numberOfUnits}
                          onChange={(e) => setNumberOfUnits(e.target.value)}
                          className="w-full rounded-xl border border-slate-200/90 px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#0754C6] focus:ring-1 focus:ring-[#0754C6] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-800 mb-1.5 block">
                        Payment option
                      </label>
                      <CustomSelect
                        value={paymentOption}
                        onChange={setPaymentOption}
                        options={PAYMENT_OPTIONS}
                        placeholder="Select payment option"
                      />
                    </div>
                  </>
                )}

                {/* TAB 4: Open House (Home of interest & Attendees) */}
                {activeTab === "open-house" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-800 mb-1.5 block">
                        Home of interest
                      </label>
                      <CustomSelect
                        value={unitType}
                        onChange={setUnitType}
                        options={UNIT_OPTIONS}
                        placeholder="Select home of interest"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-800 mb-1.5 block">
                        Attendees (including you)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={attendees}
                        onChange={(e) => setAttendees(e.target.value)}
                        className="w-full rounded-xl border border-slate-200/90 px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#0754C6] focus:ring-1 focus:ring-[#0754C6] transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Message (optional) */}
                <div>
                  <label className="text-sm font-semibold text-slate-800 mb-1.5 block">
                    Message (optional)
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Any specific questions or request..."
                    className="w-full rounded-xl border border-slate-200/90 px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#0754C6] focus:ring-1 focus:ring-[#0754C6] transition-colors resize-y"
                  />
                </div>

                {/* Error & Success Feedback */}
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                    {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm font-medium">
                    {successMsg}
                  </div>
                )}

                {/* Submit Buttons — Full Width with the card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 w-full">
                  <button
                    type="button"
                    disabled={submitting !== null}
                    onClick={handleWhatsApp}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#0754C6] hover:bg-[#0648AB] disabled:opacity-60 text-white text-sm font-semibold transition-colors shadow-sm cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>
                      {submitting === "whatsapp" ? "Saving..." : details.btnWhatsApp}
                    </span>
                  </button>

                  <button
                    type="button"
                    disabled={submitting !== null}
                    onClick={handleEmail}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-[#00ABF0] bg-white hover:bg-[#00ABF0]/5 disabled:opacity-60 text-[#00ABF0] text-sm font-semibold transition-colors cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>
                      {submitting === "email" ? "Saving..." : details.btnEmail}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Sleek & Compact Dark Navy Developer Office Sidebar */}
          <div className="w-full lg:w-[310px] xl:w-[320px] shrink-0 lg:sticky lg:top-24">
            <div className="w-full bg-[#071630] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-white/5 space-y-5">
              {/* Section 1: Developer Office */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Developer office
                </h3>

                <div className="space-y-3 text-xs sm:text-[13px] text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <p className="font-semibold text-white">
                        Dangracif Homes Limited
                      </p>
                      <p className="text-slate-300 text-xs mt-0.5">
                        Suite B5, Bricks &apos;N&apos; More Plaza, 6th Avenue,
                        Gwarimpa, Abuja, FCT, Nigeria
                      </p>
                    </div>
                  </div>

                  <a
                    href={`tel:${ESTATE_CONTACT.phone}`}
                    className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors"
                  >
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-medium">
                      {ESTATE_CONTACT.phone}
                    </span>
                  </a>

                  <a
                    href={`mailto:${ESTATE_CONTACT.email}`}
                    className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors"
                  >
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-medium">
                      {ESTATE_CONTACT.email}
                    </span>
                  </a>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/10" />

              {/* Section 2: Fidelis Court — Estate */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Fidelis Court — Estate
                </h3>

                <div className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-300">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed text-slate-300">
                    {ESTATE_CONTACT.address}
                  </p>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed pt-0.5">
                  {ESTATE_CONTACT.description}
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-white/10" />

              {/* Section 3: Operating Hours */}
              <div>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  {ESTATE_CONTACT.inspectionHours}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
