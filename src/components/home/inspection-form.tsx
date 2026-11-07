"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/custom-select";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UNIT_OPTIONS } from "@/constants/navigation";
import { InspectionFormData } from "@/types";
import { submitLeadInquiry } from "@/app/actions/admin-dashboard";

interface InspectionFormProps {
  onSubmitWhatsApp?: (data: InspectionFormData) => void;
  onSubmitEmail?: (data: InspectionFormData) => void;
  buttonVariant?: "primary" | "secondary";
  variant?: "default" | "primary";
}

export const InspectionForm: React.FC<InspectionFormProps> = ({
  onSubmitWhatsApp,
  onSubmitEmail,
  buttonVariant = "primary",
  variant,
}) => {
  const pathname = usePathname();
  const isFidelis =
    variant === "primary" ||
    buttonVariant === "primary" ||
    pathname === "/fideliscourt" ||
    pathname === "/fideliscourts" ||
    pathname === "/fidelis-court";
  const inputVariant = "default";

  const [formData, setFormData] = React.useState<InspectionFormData>({
    fullName: "",
    phone: "",
    email: "",
    unitType: "2-bed",
    preferredDate: "",
    message: "",
  });

  const handleChange = (
    field: keyof InspectionFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const [submitting, setSubmitting] = React.useState<"whatsapp" | "email" | null>(null);
  const [submissionError, setSubmissionError] = React.useState<string | null>(null);

  const recordLead = async () => {
    try {
      const res = await submitLeadInquiry({
        type: "inspection",
        fullName: formData.fullName.trim() || "Website Visitor",
        phone: formData.phone.trim() || "N/A",
        email: formData.email.trim() || "N/A",
        unitType: formData.unitType,
        preferredDate: formData.preferredDate || undefined,
        message: formData.message?.trim() || undefined,
      });
      return res;
    } catch (err) {
      console.warn("Could not save inspection lead:", err);
      return { success: false };
    }
  };

  const handleWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    const submission = { ...formData };
    setSubmitting("whatsapp");
    setSubmissionError(null);
    const result = await recordLead();
    setSubmitting(null);
    if (!result.success) {
      setSubmissionError("We couldn't save your inspection request. Please try again.");
    }
    if (onSubmitWhatsApp) {
      onSubmitWhatsApp(submission);
    } else {
      const text = `Hello Dangracif Homes, I would like to book an inspection for Fidelis Court.\n\nName: ${submission.fullName}\nPhone: ${submission.phone}\nEmail: ${submission.email}\nUnit: ${submission.unitType}\nDate: ${submission.preferredDate}\nMessage: ${submission.message || "N/A"}`;
      window.open(
        `https://wa.me/2348133187860?text=${encodeURIComponent(text)}`,
        "_blank"
      );
    }
    if (result.success) {
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        unitType: "2-bed",
        preferredDate: "",
        message: "",
      });
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const submission = { ...formData };
    setSubmitting("email");
    setSubmissionError(null);
    const result = await recordLead();
    setSubmitting(null);
    if (!result.success) {
      setSubmissionError("We couldn't save your inspection request. Please try again.");
    }
    if (onSubmitEmail) {
      onSubmitEmail(submission);
    } else {
      const subject = `Inspection Booking - ${submission.fullName} (Fidelis Court)`;
      const body = `Name: ${submission.fullName}\nPhone: ${submission.phone}\nEmail: ${submission.email}\nUnit: ${submission.unitType}\nDate: ${submission.preferredDate}\nMessage: ${submission.message || "N/A"}`;
      window.location.href = `mailto:info@dangracif.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
    }
    if (result.success) {
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        unitType: "2-bed",
        preferredDate: "",
        message: "",
      });
    }
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-10 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/40 dark:shadow-black/20">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Book Inspection
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
          Choose a date and we&apos;ll confirm your visit to Fidelis Court, Kubwa F01.
        </p>
      </div>

      <form className="space-y-5">
        {/* Full Name */}
        <Input
          label="Full name"
          placeholder="e.g. John Doe"
          value={formData.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          variant={inputVariant}
          required
        />

        {/* Phone & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone / WhatsApp"
            type="tel"
            placeholder="+234..."
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            variant={inputVariant}
            required
          />

          <Input
            label="Email"
            type="email"
            placeholder="name@domain.com"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            variant={inputVariant}
            required
          />
        </div>

        {/* Unit Type & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CustomSelect
            label="Unit type"
            value={formData.unitType}
            onChange={(val) => handleChange("unitType", val)}
            options={UNIT_OPTIONS.map((u) => ({
              label: u.label,
              value: u.value,
            }))}
            variant={inputVariant}
            required
          />

          <DatePicker
            label="Preferred inspection date"
            value={formData.preferredDate}
            onChange={(val) => handleChange("preferredDate", val)}
            placeholder="Select a date"
            variant={inputVariant}
            required
          />
        </div>

        {/* Message */}
        <Textarea
          label="Message (optional)"
          placeholder="Any specific questions or request..."
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          variant={inputVariant}
        />

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3.5 pt-2">
          <Button
            type="button"
            variant={"primary"}
            size="md"
            disabled={submitting !== null}
            onClick={handleWhatsApp}
            leftIcon={<MessageSquare className="h-4 w-4" />}
          >
            {submitting === "whatsapp" ? "Saving..." : "Send via WhatsApp"}
          </Button>

          <Button
            type="button"
            variant={"secondary"}
            size="md"
            disabled={submitting !== null}
            onClick={handleEmail}
            leftIcon={<Mail className="h-4 w-4" />}
          >
            {submitting === "email" ? "Saving..." : "Send via Email"}
          </Button>
        </div>
        {submissionError && (
          <p role="alert" className="text-sm text-red-600">
            {submissionError}
          </p>
        )}
      </form>
    </div>
  );
};
