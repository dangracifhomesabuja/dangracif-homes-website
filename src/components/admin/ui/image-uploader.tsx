"use client";

import * as React from "react";
import Image from "next/image";
import { Upload, X, Loader2, Link as LinkIcon, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  onUploadStateChange?: (isUploading: boolean) => void;
  folder?: string;
  label?: string;
  hint?: string;
}

export function ImageUploader({
  value,
  onChange,
  onUploadStateChange,
  folder = "general",
  label = "Upload Image",
  hint = "PNG, JPG, WebP up to 10MB (Cloudinary optimized)",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);
  const [showUrlInput, setShowUrlInput] = React.useState(false);
  const [urlDraft, setUrlDraft] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadFile = async (file: File) => {
    if (!file || isUploading) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WebP)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large. Max 10MB allowed.");
      return;
    }

    setIsUploading(true);
    onUploadStateChange?.(true);
    const toastId = toast.loading("Uploading image via Cloudinary...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success || typeof data.url !== "string") {
        throw new Error(data.error || "Failed to upload image");
      }

      onChange(data.url);
      toast.success("Image uploaded successfully!", { id: toastId });
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Upload failed",
        { id: toastId }
      );
    } finally {
      setIsUploading(false);
      onUploadStateChange?.(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700">{label}</label>
          <button
            type="button"
            disabled={isUploading}
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] font-semibold text-[#00ABF0] hover:underline cursor-pointer flex items-center gap-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlInput ? "Upload File" : "Paste URL"}</span>
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        disabled={isUploading}
        onChange={(e) => {
          if (e.target.files?.[0]) handleUploadFile(e.target.files[0]);
        }}
        className="hidden"
      />

      {showUrlInput ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlDraft}
            disabled={isUploading}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder="https://res.cloudinary.com/..."
            className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20 focus:border-[#0754C6]"
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => {
              const url = urlDraft.trim();
              const isLocalPath = url.startsWith("/") && !url.startsWith("//");
              let isCloudinaryUrl = false;
              try {
                const parsedUrl = new URL(url);
                isCloudinaryUrl =
                  parsedUrl.protocol === "https:" &&
                  parsedUrl.hostname === "res.cloudinary.com";
              } catch {
                isCloudinaryUrl = false;
              }

              if (!isLocalPath && !isCloudinaryUrl) {
                toast.error("Enter a Cloudinary URL or a path from this website.");
                return;
              }

              onChange(url);
              setShowUrlInput(false);
              setUrlDraft("");
              toast.success("Image URL applied");
            }}
            className="px-3.5 py-2 bg-[#0754C6] text-white text-xs font-semibold rounded-lg hover:bg-[#0648AB] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            Apply
          </button>
        </div>
      ) : value ? (
        <div className="relative rounded-lg border border-slate-200 overflow-hidden bg-slate-50 group">
          <div className="relative h-44 w-full bg-slate-100 flex items-center justify-center">
            {/* Image Preview */}
            <Image
              src={value}
              alt="Uploaded preview"
              fill
              sizes="(max-width: 640px) 100vw, 480px"
              className="object-cover"
              unoptimized
            />
            {isUploading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-slate-900/60 text-sm font-semibold text-white">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading replacement...
              </div>
            )}
            <div className={`absolute inset-0 z-20 bg-slate-900/30 transition-opacity flex items-center justify-center gap-2 ${
              isUploading ? "pointer-events-none opacity-0" : "opacity-0 group-hover:opacity-100"
            }`}>
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-md bg-white/90 text-slate-900 text-xs font-bold hover:bg-white shadow-xs cursor-pointer"
              >
                Change Image
              </button>
              <button
                type="button"
                disabled={isUploading}
                onClick={() => onChange("")}
                className="p-1.5 rounded-md bg-red-600/90 text-white hover:bg-red-600 shadow-xs cursor-pointer"
                title="Remove Image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-2.5 bg-white border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="truncate max-w-[240px] font-mono">{value}</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Attached
            </span>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          aria-disabled={isUploading}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
            dragActive
              ? "border-[#0754C6] bg-blue-50/50"
              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-[#0754C6]/10 text-[#00ABF0] flex items-center justify-center">
              {isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                {isUploading ? "Uploading to Cloudinary..." : "Click to upload or drag & drop"}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">{hint}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
