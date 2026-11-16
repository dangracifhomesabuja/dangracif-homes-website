import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { isCloudinaryConfigured, uploadMediaBuffer } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isCloudinaryConfigured) {
      return NextResponse.json(
        { error: "Cloudinary is not configured. Add its credentials before uploading." },
        { status: 503 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const isPdf = file.type === "application/pdf";
    const supportedImageTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/gif",
    ];

    if (isPdf && !["brochures", "terms-and-conditions"].includes(folder)) {
      return NextResponse.json(
        { error: "PDF files can only be uploaded to the brochure or terms and conditions folders." },
        { status: 400 }
      );
    }

    if (!isPdf && !supportedImageTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Upload a PNG, JPG, WebP, GIF, or PDF file." },
        { status: 400 }
      );
    }

    const maxFileSize = isPdf ? 20 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxFileSize) {
      return NextResponse.json(
        {
          error: isPdf
            ? "PDF is too large. Maximum file size is 20MB."
            : "Image is too large. Maximum file size is 10MB.",
        },
        { status: 413 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    if (
      isPdf &&
      buffer.subarray(0, 5).toString("ascii") !== "%PDF-"
    ) {
      return NextResponse.json(
        { error: "The selected file is not a valid PDF." },
        { status: 400 }
      );
    }
    const safeFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, "");
    const url = await uploadMediaBuffer(
      buffer,
      safeFolder,
      isPdf ? "raw" : "image",
      isPdf
        ? `fidelis-court-${folder}-${Date.now()}.pdf`
        : undefined
    );

    return NextResponse.json({
      success: true,
      url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload file" },
      { status: 500 }
    );
  }
}
