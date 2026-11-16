"use client";

import * as React from "react";
import { FileText, Loader2, Trash2, Upload } from "lucide-react";
import toast from "react-hot-toast";

interface DocumentUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: "brochures" | "terms-and-conditions";
}

export function DocumentUploader({
  value,
  onChange,
  label = "brochure",
  folder = "brochures",
}: DocumentUploaderProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error(`Choose a PDF ${label}.`);
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("PDF is too large. Maximum file size is 20MB.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading(`Uploading ${label} to Cloudinary...`);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const result: unknown = await response.json();

      if (
        !response.ok ||
        !result ||
        typeof result !== "object" ||
        !("success" in result) ||
        result.success !== true ||
        !("url" in result) ||
        typeof result.url !== "string"
      ) {
        const errorMessage =
          result &&
          typeof result === "object" &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : `Failed to upload ${label}.`;
        throw new Error(errorMessage);
      }

      onChange(result.url);
      toast.success(`${label} uploaded. Save changes to publish it.`, {
        id: toastId,
      });
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : `${label} upload failed.`,
        { id: toastId }
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void uploadFile(file);
        }}
      />

      {value ? (
        <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <FileText aria-hidden="true" className="h-5 w-5 shrink-0 text-red-600" />
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="truncate text-sm font-medium text-slate-700 hover:text-[#0754C6]"
            >
              View current {label}
            </a>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Replace PDF
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={isUploading}
              aria-label={`Remove ${label}`}
              className="inline-flex items-center justify-center rounded-md border border-slate-200 px-3 py-2 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white px-4 py-8 text-sm font-medium text-slate-600 hover:border-[#0754C6] hover:text-[#0754C6] disabled:opacity-60"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {isUploading ? "Uploading PDF..." : `Upload ${label} PDF`}
        </button>
      )}
      <p className="text-xs text-slate-500">PDF only, up to 20MB.</p>
    </div>
  );
}
