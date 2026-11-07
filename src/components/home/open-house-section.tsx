"use client";

import * as React from "react";
import Image from "next/image";
import { useSiteImage } from "@/components/common/site-images-provider";
import { Users, MapPin, MessageSquare, Mail } from "lucide-react";
import { OpenHouseFormData } from "@/types";
import { submitLeadInquiry } from "@/app/actions/admin-dashboard";
import { CustomSelect } from "@/components/ui/custom-select";
import { UNIT_OPTIONS } from "@/constants/navigation";

export const OpenHouseSection: React.FC = () => {
  const openHouseImage = useSiteImage(
    "/fidelis-court/Sunlit Construction Site Under Dramatic Skies.png"
  );
  const [formData, setFormData] = React.useState<OpenHouseFormData>({
    fullName: "",
    phone: "",
    email: "",
    homeOfInterest: "2-bed",
    attendees: 1,
    message: "",
  });

  const handleChange = (
    field: keyof OpenHouseFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const [submitting, setSubmitting] = React.useState<"whatsapp" | "email" | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const recordLead = async () => {
    try {
      const res = await submitLeadInquiry({
        type: "open-house",
        fullName: formData.fullName.trim() || "Website Visitor",
        phone: formData.phone.trim() || "N/A",
        email: formData.email.trim() || "N/A",
        unitType: formData.homeOfInterest,
        attendees: Number(formData.attendees) || 1,
        message: formData.message?.trim() || undefined,
      });
      return res;
    } catch (err) {
      console.warn("Could not save open house lead:", err);
      return { success: false };
    }
  };

  const validateForm = () => {
    setErrorMsg(null);
    if (!formData.fullName.trim()) {
      setErrorMsg("Please enter your full name.");
      return false;
    }
    if (!formData.phone.trim() && !formData.email.trim()) {
      setErrorMsg("Please provide either your phone number or email.");
      return false;
    }
    return true;
  };

  const handleWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submission = { ...formData };
    setSubmitting("whatsapp");
    setSuccessMsg("Registering your open house reservation...");
    setErrorMsg(null);
    const result = await recordLead();
    setSubmitting(null);
    if (result.success) {
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        homeOfInterest: "2-bed",
        attendees: 1,
        message: "",
      });
      setSuccessMsg("Registration saved! Opening WhatsApp...");
    } else {
      setSuccessMsg(null);
      setErrorMsg("We couldn't save your registration. Your message will still open in WhatsApp; please try again if needed.");
    }

    const text = `Hello Dangracif Homes, I would like to register for the Fidelis Court Open House.\n\nName: ${submission.fullName}\nPhone: ${submission.phone}\nEmail: ${submission.email}\nHome of interest: ${submission.homeOfInterest}\nAttendees: ${submission.attendees}\nMessage: ${submission.message || "N/A"}`;
    window.open(
      `https://wa.me/2348133187860?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submission = { ...formData };
    setSubmitting("email");
    setSuccessMsg("Registering your open house reservation...");
    setErrorMsg(null);
    const result = await recordLead();
    setSubmitting(null);
    if (result.success) {
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        homeOfInterest: "2-bed",
        attendees: 1,
        message: "",
      });
      setSuccessMsg("Registration saved! Opening your email app...");
    } else {
      setSuccessMsg(null);
      setErrorMsg("We couldn't save your registration. Your message will still open in your email app; please try again if needed.");
    }

    const subject = `Open House Registration - ${submission.fullName}`;
    const body = `Name: ${submission.fullName}\nPhone: ${submission.phone}\nEmail: ${submission.email}\nHome of interest: ${submission.homeOfInterest}\nAttendees: ${submission.attendees}\nMessage: ${submission.message || "N/A"}`;
    window.location.href = `mailto:info@dangracif.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="w-full bg-[#EBF3FC] py-14 sm:py-18">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* Left Column: Event Info & Estate Image */}
          <div className="space-y-6">
            <div className="space-y-3">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00ABF0]">
                Ongoing Event • Fidelis Court
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight">
                Fidelis Court Open House
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-lg">
                Visit the estate, meet our sales team and explore your next home. Register your interest in attending our ongoing open house.
              </p>
            </div>

            {/* Location Address */}
            <div className="flex items-start gap-2.5 text-zinc-700">
              <MapPin className="h-5 w-5 text-[#00ABF0] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-zinc-900">
                  Fidelis Court
                </p>
                <p className="text-sm text-zinc-600 mt-0.5">
                  21, Josephat Mojeckwu Avenue, Kubwa F01, Abuja, FCT, Nigeria
                </p>
              </div>
            </div>

            {/* Estate Photo Container */}
            <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden bg-zinc-200 shadow-sm">
              <Image
                src={openHouseImage}
                alt="Fidelis Court Open House Estate"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Right Column: Registration Form (No White Card Box) */}
          <div className="space-y-5">
            <div className="flex items-center gap-2.5 mb-2">
              <Users className="h-5 w-5 text-[#00ABF0]" />
              <h3 className="text-xl font-bold tracking-tight text-zinc-900">
                Open-house registration
              </h3>
            </div>

            <form className="space-y-4">
              {/* Full name */}
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-white border border-zinc-200 text-sm text-zinc-900 outline-none focus:border-[#0754C6] focus:ring-2 focus:ring-[#0754C6]/15 transition-all"
                  placeholder=""
                />
              </div>

              {/* Phone & Email - stacked on mobile, side-by-side on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-sm font-semibold text-zinc-900 mb-1.5">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-zinc-200 text-sm text-zinc-900 outline-none focus:border-[#0754C6] focus:ring-2 focus:ring-[#0754C6]/15 transition-all"
                    placeholder=""
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-900 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-zinc-200 text-sm text-zinc-900 outline-none focus:border-[#0754C6] focus:ring-2 focus:ring-[#0754C6]/15 transition-all"
                    placeholder=""
                  />
                </div>
              </div>

              {/* Home of interest & Attendees - stacked on mobile, side-by-side on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <CustomSelect
                  label="Home of interest"
                  value={formData.homeOfInterest}
                  onChange={(value) => handleChange("homeOfInterest", value)}
                  options={UNIT_OPTIONS.map(({ label, value }) => ({ label, value }))}
                />

                <div>
                  <label className="block text-sm font-semibold text-zinc-900 mb-1.5">
                    Attendees (including you)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.attendees}
                    onChange={(e) =>
                      handleChange("attendees", parseInt(e.target.value) || 1)
                    }
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-zinc-200 text-sm text-zinc-900 outline-none focus:border-[#0754C6] focus:ring-2 focus:ring-[#0754C6]/15 transition-all"
                  />
                </div>
              </div>

              {/* Message (optional) */}
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-1.5">
                  Message (optional)
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  className="w-full min-h-[96px] p-3 rounded-xl bg-white border border-zinc-200 text-sm text-zinc-900 outline-none focus:border-[#0754C6] focus:ring-2 focus:ring-[#0754C6]/15 transition-all resize-y"
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

              {/* Action Buttons - stacked on mobile */}
              <div className="flex flex-col sm:grid sm:grid-cols-2 w-full gap-3 pt-1">
                <button
                  type="button"
                  disabled={submitting !== null}
                  onClick={handleWhatsApp}
                  className="w-full h-12 px-4 rounded-full bg-[#0754C6] hover:bg-[#0648AB] disabled:opacity-60 text-white font-semibold text-sm sm:text-base inline-flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
                >
                  <MessageSquare className="h-5 w-5 shrink-0" />
                  <span>
                    {submitting === "whatsapp" ? "Registering..." : "Register via WhatsApp"}
                  </span>
                </button>

                <button
                  type="button"
                  disabled={submitting !== null}
                  onClick={handleEmail}
                  className="w-full h-12 px-4 rounded-full bg-white border border-[#00ABF0] hover:bg-zinc-50 disabled:opacity-60 text-[#00ABF0] font-semibold text-sm sm:text-base inline-flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Mail className="h-5 w-5 shrink-0" />
                  <span>
                    {submitting === "email" ? "Registering..." : "Register via Email"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
