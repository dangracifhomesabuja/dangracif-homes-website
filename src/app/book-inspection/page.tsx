"use client";

import * as React from "react";
import { MessageCircle, Mail } from "lucide-react";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { UNIT_OPTIONS } from "@/constants/navigation";
import { submitLeadInquiry } from "@/app/actions/admin-dashboard";
import { CustomSelect } from "@/components/ui/custom-select";
import { DatePicker } from "@/components/ui/date-picker";

export default function BookInspectionPage() {
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [unitType, setUnitType] = React.useState("2-bed");
  const [preferredDate, setPreferredDate] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [submitting, setSubmitting] = React.useState<"whatsapp" | "email" | null>(null);
  const [submissionError, setSubmissionError] = React.useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = React.useState<string | null>(null);

  const recordLead = async () => {
    try {
      return await submitLeadInquiry({
        type: "inspection",
        fullName: fullName.trim() || "Website Visitor",
        phone: phone.trim() || "N/A",
        email: email.trim() || "N/A",
        unitType,
        preferredDate: preferredDate || undefined,
        message: message.trim() || undefined,
      });
    } catch (err) {
      console.warn("Could not record lead:", err);
      return { success: false };
    }
  };

  const resetForm = () => {
    setFullName("");
    setPhone("");
    setEmail("");
    setUnitType("2-bed");
    setPreferredDate("");
    setMessage("");
  };

  const handleWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    const submission = { fullName, phone, email, unitType, preferredDate, message };
    setSubmitting("whatsapp");
    setSubmissionError(null);
    setSubmissionSuccess(null);
    const result = await recordLead();
    setSubmitting(null);
    if (result.success) {
      resetForm();
      setSubmissionSuccess("Inspection request recorded successfully. Opening WhatsApp...");
    } else {
      setSubmissionError("We couldn't save your inspection request. Your message will still open in WhatsApp; please try again if needed.");
    }
    const selectedUnit = UNIT_OPTIONS.find((unit) => unit.value === submission.unitType);
    const text = `Hello Dangracif Homes, I would like to book an inspection for Fidelis Court.\n\nFull Name: ${submission.fullName || "N/A"
      }\nPhone: ${submission.phone || "N/A"}\nEmail: ${submission.email || "N/A"}\nUnit: ${selectedUnit?.label ?? "2-Bedroom Apartment — ₦82,500,000"}\nPreferred Date: ${submission.preferredDate || "N/A"
      }\nMessage: ${submission.message || "N/A"}`;
    window.open(
      `https://wa.me/2348133187860?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const submission = { fullName, phone, email, unitType, preferredDate, message };
    setSubmitting("email");
    setSubmissionError(null);
    setSubmissionSuccess(null);
    const result = await recordLead();
    setSubmitting(null);
    if (result.success) {
      resetForm();
      setSubmissionSuccess("Inspection request recorded successfully. Opening your email app...");
    } else {
      setSubmissionError("We couldn't save your inspection request. Your message will still open in your email app; please try again if needed.");
    }
    const selectedUnit = UNIT_OPTIONS.find((unit) => unit.value === submission.unitType);
    const subject = `Inspection Booking - ${submission.fullName || "Fidelis Court"}`;
    const body = `Request: Book an Inspection\n\nFull Name: ${submission.fullName || "N/A"
      }\nPhone: ${submission.phone || "N/A"}\nEmail: ${submission.email || "N/A"}\nUnit: ${selectedUnit?.label ?? "2-Bedroom Apartment — ₦82,500,000"}\nPreferred Date: ${submission.preferredDate || "N/A"
      }\nMessage: ${submission.message || "N/A"}`;
    window.location.href = `mailto:info@dangracif.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen bg-[#FAFCFE] text-zinc-900 flex flex-col antialiased">
      <Header />

      <main className="flex-1 w-full bg-[#FAFCFE] py-8 sm:py-10 lg:py-12">
        <div className="max-w-3xl mx-auto px-6 sm:px-6 lg:px-8">
          {/* Eyebrow */}
          <span className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#00ABF0] block">
            FIDELIS COURT · KUBWA F01
          </span>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#081734] tracking-tight mt-2 mb-8 sm:mb-10">
            Book an Inspection
          </h1>

          {/* Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {submissionError && (
              <p role="alert" className="text-sm text-red-700">{submissionError}</p>
            )}
            {submissionSuccess && (
              <p role="status" className="text-sm text-green-700">{submissionSuccess}</p>
            )}
            {/* Full name */}
            <div>
              <label className="text-sm font-semibold text-slate-800 mb-1.5 block">
                Full name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-slate-200/90 bg-white px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#0754C6] focus:ring-1 focus:ring-[#0754C6] transition-colors shadow-xs"
              />
            </div>

            {/* Phone / WhatsApp & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-800 mb-1.5 block">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200/90 bg-white px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#0754C6] focus:ring-1 focus:ring-[#0754C6] transition-colors shadow-xs"
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
                  className="w-full rounded-xl border border-slate-200/90 bg-white px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#0754C6] focus:ring-1 focus:ring-[#0754C6] transition-colors shadow-xs"
                />
              </div>
            </div>

            {/* Unit type & Preferred inspection date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomSelect
                label="Unit type"
                value={unitType}
                onChange={setUnitType}
                options={UNIT_OPTIONS.map(({ label, value }) => ({ label, value }))}
              />

              <DatePicker
                label="Preferred inspection date"
                value={preferredDate}
                onChange={setPreferredDate}
                placeholder="Select a date"
              />
            </div>

            {/* Message (optional) */}
            <div>
              <label className="text-sm font-semibold text-slate-800 mb-1.5 block">
                Message (optional)
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl border border-slate-200/90 bg-white px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#0754C6] focus:ring-1 focus:ring-[#0754C6] transition-colors shadow-xs resize-y"
              />
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <button
                type="button"
                disabled={submitting !== null}
                onClick={handleWhatsApp}
                className="w-full bg-[#0754C6] hover:bg-[#0648AB] disabled:opacity-60 text-white font-semibold py-3.5 px-6 rounded-full flex items-center justify-center gap-2.5 transition-all shadow-md shadow-[#0754C6]/20 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{submitting === "whatsapp" ? "Saving..." : "Send via WhatsApp"}</span>
              </button>

              <button
                type="button"
                disabled={submitting !== null}
                onClick={handleEmail}
                className="w-full bg-white hover:bg-blue-50/50 disabled:opacity-60 text-[#00ABF0] border-2 border-[#00ABF0] font-semibold py-3.5 px-6 rounded-full flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <Mail className="w-5 h-5 text-[#00ABF0]" />
                <span>{submitting === "email" ? "Saving..." : "Send via Email"}</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
