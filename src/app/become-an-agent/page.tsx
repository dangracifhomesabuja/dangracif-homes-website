"use client";

import * as React from "react";
import {
  BadgePercent,
  Users,
  Handshake,
  MessageCircle,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { submitLeadInquiry } from "@/app/actions/admin-dashboard";

export default function BecomeAnAgentPage() {
  const [applyingAs, setApplyingAs] = React.useState<"individual" | "company">(
    "individual"
  );
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [experience, setExperience] = React.useState("");
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = React.useState(false);

  const validateForm = () => {
    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return false;
    }
    if (!phone.trim()) {
      setErrorMessage("Please enter your phone / WhatsApp number.");
      return false;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    if (!address.trim()) {
      setErrorMessage("Please enter your full address.");
      return false;
    }
    if (!acceptedTerms) {
      setErrorMessage(
        "Please confirm that you accept the 3% agency fee agreement."
      );
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const recordLeadToBackend = async () => {
    try {
      const res = await submitLeadInquiry({
        type: "agent",
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        unitType:
          applyingAs === "company"
            ? "Company Agent Application"
            : "Individual Agent Application",
        message: [
          `Applying as: ${
            applyingAs === "company" ? "Company" : "Individual"
          }`,
          `Address: ${address.trim()}`,
          `Real Estate Experience: ${experience.trim() || "None stated"}`,
          `Agreement: Accepted 3% agency fee for referring clients`,
        ].join("\n"),
      });
      return res;
    } catch (err) {
      console.warn("Error saving agent application lead:", err);
      return { success: false };
    }
  };

  const handleWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submission = { applyingAs, fullName, phone, email, address, experience };
    const text = [
      `Hello Dangracif Homes, I would like to apply as a Fidelis Court Agent.`,
      ``,
      `Applying as: ${submission.applyingAs === "company" ? "Company" : "Individual"}`,
      `Full name: ${submission.fullName}`,
      `Phone: ${submission.phone}`,
      `Email: ${submission.email}`,
      `Address: ${submission.address}`,
      `Real Estate Experience: ${submission.experience || "None"}`,
      `Agency Agreement: I accept a 3% agency fee for referring a client to Dangracif Homes.`,
    ].join("\n");

    setIsSubmitting(true);
    setSubmittedSuccess(false);
    const result = await recordLeadToBackend();
    setIsSubmitting(false);
    if (result.success) {
      setSubmittedSuccess(true);
      setFullName("");
      setPhone("");
      setEmail("");
      setAddress("");
      setExperience("");
      setApplyingAs("individual");
      setAcceptedTerms(false);
    } else {
      setErrorMessage("We couldn't save your application. Your message will still open in WhatsApp; please try again if needed.");
    }

    const waUrl = `https://wa.me/2348133187860?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submission = { applyingAs, fullName, phone, email, address, experience };
    const subject = `Agent Application - ${submission.fullName}`;
    const body = [
      `Hello Dangracif Homes,`,
      ``,
      `I would like to apply as an official Agent for Fidelis Court.`,
      ``,
      `Applying as: ${submission.applyingAs === "company" ? "Company" : "Individual"}`,
      `Full name: ${submission.fullName}`,
      `Phone: ${submission.phone}`,
      `Email: ${submission.email}`,
      `Address: ${submission.address}`,
      `Real Estate Experience: ${submission.experience || "None"}`,
      `Agency Agreement: I accept a 3% agency fee for referring a client to Dangracif Homes.`,
    ].join("\n");

    setIsSubmitting(true);
    setSubmittedSuccess(false);
    const result = await recordLeadToBackend();
    setIsSubmitting(false);
    if (result.success) {
      setSubmittedSuccess(true);
      setFullName("");
      setPhone("");
      setEmail("");
      setAddress("");
      setExperience("");
      setApplyingAs("individual");
      setAcceptedTerms(false);
    } else {
      setErrorMessage("We couldn't save your application. Your message will still open in your email app; please try again if needed.");
    }

    window.location.href = `mailto:info@dangracif.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen bg-[#FAFCFE] text-zinc-900 flex flex-col antialiased">
      <Header />

      <main className="flex-1 w-full py-10 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Info & Value Props */}
            <div className="lg:col-span-5 space-y-6 sm:space-y-8">
              <div className="space-y-3">
                <span className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#00ABF0] block">
                  PARTNER WITH US
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#081734] tracking-tight leading-[1.15]">
                  Become an agent
                </h1>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
                  Help families and investors find their home at Fidelis Court,
                  Kubwa F01 — and earn while you do it.
                </p>
              </div>

              {/* 3 Value Cards */}
              <div className="space-y-4">
                {/* Card 1 */}
                <div className="rounded-2xl bg-[#EEF5FF] p-5 sm:p-6 flex items-start gap-4 border border-blue-100/70 shadow-xs hover:shadow-md transition-all duration-300 group">
                  <div className="h-11 w-11 rounded-xl bg-white/90 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform">
                    <BadgePercent className="w-6 h-6 text-[#00ABF0]" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight">
                      3% agency fee
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      Earn a 3% agency fee for referring a client.
                    </p>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="rounded-2xl bg-[#EEF5FF] p-5 sm:p-6 flex items-start gap-4 border border-blue-100/70 shadow-xs hover:shadow-md transition-all duration-300 group">
                  <div className="h-11 w-11 rounded-xl bg-white/90 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-[#00ABF0]" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight">
                      Sales support
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      Brochures, pricing sheets and site tours for your clients.
                    </p>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="rounded-2xl bg-[#EEF5FF] p-5 sm:p-6 flex items-start gap-4 border border-blue-100/70 shadow-xs hover:shadow-md transition-all duration-300 group">
                  <div className="h-11 w-11 rounded-xl bg-white/90 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform">
                    <Handshake className="w-6 h-6 text-[#00ABF0]" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight">
                      Trusted project
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      Clear pricing, flexible payment plan and Deed of lease
                      title.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Agent Application Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-white border border-slate-200/90 shadow-lg shadow-slate-900/5 p-6 sm:p-8 lg:p-10 space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Agent application
                  </h2>
                </div>

                {/* Alerts */}
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-sm animate-in fade-in">
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {submittedSuccess && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-sm animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                    <span>
                      Application recorded successfully! Redirecting your
                      message...
                    </span>
                  </div>
                )}

                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  {/* Applying as (Radio Group) */}
                  <div>
                    <label className="text-sm font-semibold text-slate-800 mb-2.5 block">
                      Applying as
                    </label>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="applyingAs"
                          value="individual"
                          checked={applyingAs === "individual"}
                          onChange={() => setApplyingAs("individual")}
                          className="w-4 h-4 text-[#0754C6] focus:ring-[#0754C6] cursor-pointer"
                        />
                        <span className="text-sm font-medium text-slate-800">
                          Individual
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="applyingAs"
                          value="company"
                          checked={applyingAs === "company"}
                          onChange={() => setApplyingAs("company")}
                          className="w-4 h-4 text-[#0754C6] focus:ring-[#0754C6] cursor-pointer"
                        />
                        <span className="text-sm font-medium text-slate-800">
                          Company
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Full name */}
                  <div>
                    <label className="text-sm font-semibold text-slate-800 mb-1.5 block">
                      {applyingAs === "company"
                        ? "Company name / Contact person"
                        : "Full name"}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder=""
                      className="w-full rounded-xl border border-slate-200/90 bg-white px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#0754C6] focus:ring-1 focus:ring-[#0754C6] transition-colors shadow-xs"
                    />
                  </div>

                  {/* Phone / WhatsApp */}
                  <div>
                    <label className="text-sm font-semibold text-slate-800 mb-1.5 block">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder=""
                      className="w-full rounded-xl border border-slate-200/90 bg-white px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#0754C6] focus:ring-1 focus:ring-[#0754C6] transition-colors shadow-xs"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-sm font-semibold text-slate-800 mb-1.5 block">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder=""
                      className="w-full rounded-xl border border-slate-200/90 bg-white px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#0754C6] focus:ring-1 focus:ring-[#0754C6] transition-colors shadow-xs"
                    />
                  </div>

                  {/* Full address */}
                  <div>
                    <label className="text-sm font-semibold text-slate-800 mb-1.5 block">
                      Full address
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder=""
                      className="w-full rounded-xl border border-slate-200/90 bg-white px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#0754C6] focus:ring-1 focus:ring-[#0754C6] transition-colors shadow-xs resize-y"
                    />
                  </div>

                  {/* Real estate experience (optional) */}
                  <div>
                    <label className="text-sm font-semibold text-slate-800 mb-1.5 block">
                      Real estate experience (optional)
                    </label>
                    <input
                      type="text"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder=""
                      className="w-full rounded-xl border border-slate-200/90 bg-white px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#0754C6] focus:ring-1 focus:ring-[#0754C6] transition-colors shadow-xs"
                    />
                  </div>

                  {/* Agreement Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-slate-300 text-[#0754C6] focus:ring-[#0754C6] cursor-pointer shrink-0"
                      />
                      <span className="text-xs sm:text-sm text-slate-700 leading-snug">
                        I accept a{" "}
                        <strong className="text-slate-900 font-bold">
                          3% agency fee
                        </strong>{" "}
                        for referring a client to Dangracif Homes.
                      </span>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-3">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleWhatsApp}
                      className="w-full bg-[#0754C6] hover:bg-[#0648AB] active:scale-[0.98] text-white font-semibold py-3.5 px-6 rounded-full flex items-center justify-center gap-2.5 transition-all shadow-md shadow-[#0754C6]/25 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                      ) : (
                        <MessageCircle className="w-5 h-5 text-white" />
                      )}
                      <span>Apply via WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleEmail}
                      className="w-full bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-800 border border-slate-200/90 font-semibold py-3.5 px-6 rounded-full flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      <Mail className="w-5 h-5 text-slate-700" />
                      <span>Apply via Email</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
