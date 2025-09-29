import sharp from "sharp";
import { uploadToImageKit } from "@/lib/imagekit";

export const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"] as const;

export class ImageValidationError extends Error {
  status = 400 as const;
  constructor(message: string) {
    super(message);
    this.name = "ImageValidationError";
  }
}

function ensureWithinLimit(size: number, maxBytes = 3 * 1024 * 1024) {
  if (size > maxBytes) {
    throw new ImageValidationError("Each file must be 3MB or below");
  }
}

function validateMime(mime: string) {
  if (!allowedMimes.includes(mime as any)) {
    throw new ImageValidationError("Only JPEG, JPG, PNG, and WEBP images are allowed");
  }
}

async function toWebpIfNeeded(file: Express.Multer.File): Promise<Buffer> {
  if (file.mimetype === "image/webp") return file.buffer;
  return sharp(file.buffer).webp({ lossless: true }).toBuffer();
}

function uniqueName(ext = "webp") {
  const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  return `${unique}.${ext}`;
}

export type UploadResult = string[]; // array of URLs

/**
 * Process and upload one or many Multer files to ImageKit.
 * - Validates size (<=3MB) and mime type (jpeg/jpg/png/webp)
 * - Converts to lossless webp when source is not webp
 * - Uploads to ImageKit and returns the hosted URLs
 */
export async function processAndUploadImages(
  input: Express.Multer.File | Express.Multer.File[] | undefined,
  options?: { folder?: string }
): Promise<UploadResult> {
  if (!input) return [];
  const files = Array.isArray(input) ? input : [input];
  if (!files.length) return [];

  const folder = options?.folder ?? "/beaded/uploads";

  const urls = await Promise.all(
    files.map(async (file) => {
      validateMime(file.mimetype);
      ensureWithinLimit(file.size);

      const buffer = await toWebpIfNeeded(file);
      const fileName = uniqueName("webp");
      return uploadToImageKit({ file: buffer, fileName, folder });
    })
  );

  return urls;
}
