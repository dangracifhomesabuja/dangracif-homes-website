import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Initialize Cloudinary config
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export async function uploadMediaBuffer(
  buffer: Buffer,
  folder: string = "dangracif",
  resourceType: "image" | "raw" = "image",
  publicId?: string
): Promise<string> {
  if (!isCloudinaryConfigured) {
    throw new Error("Cloudinary is not configured.");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `dangracif/${folder}`,
        resource_type: resourceType,
        ...(publicId ? { public_id: publicId } : {}),
      },
      (error, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
          return;
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
}

export function createPdfDownloadUrl(url: string, documentName: string): string {
  if (!isCloudinaryConfigured || !cloudName) {
    throw new Error("Cloudinary is not configured.");
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error(`The ${documentName} URL is invalid.`);
  }

  const pathPrefix = `/${cloudName}/raw/upload/`;
  if (
    parsedUrl.protocol !== "https:" ||
    parsedUrl.hostname !== "res.cloudinary.com" ||
    !parsedUrl.pathname.startsWith(pathPrefix)
  ) {
    throw new Error(`The ${documentName} must be uploaded to this Cloudinary account.`);
  }

  const assetPath = parsedUrl.pathname.slice(pathPrefix.length);
  const publicId = assetPath.replace(/^v\d+\//, "");
  if (!publicId || !publicId.toLowerCase().endsWith(".pdf")) {
    throw new Error(`The Cloudinary ${documentName} URL is missing its asset ID.`);
  }

  return cloudinary.utils.private_download_url(
    decodeURIComponent(publicId),
    "pdf",
    {
      resource_type: "raw",
      type: "upload",
      attachment: true,
      expires_at: Math.floor(Date.now() / 1000) + 15 * 60,
    }
  );
}
