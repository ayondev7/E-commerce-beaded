import sharp from "sharp";
import { uploadToImageKit } from "../lib/imagekit.js";

export const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export class ImageValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ImageValidationError";
    this.status = 400;
  }
}

function ensureWithinLimit(size, maxBytes = 3 * 1024 * 1024) {
  if (size > maxBytes) {
    throw new ImageValidationError("Each file must be 3MB or below");
  }
}

function validateMime(mime) {
  if (!allowedMimes.includes(mime)) {
    throw new ImageValidationError("Only JPEG, JPG, PNG, and WEBP images are allowed");
  }
}

async function toWebpIfNeeded(file) {
  if (file.mimetype === "image/webp") return file.buffer;
  return sharp(file.buffer).webp({ lossless: true }).toBuffer();
}

function uniqueName(ext = "webp") {
  const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  return `${unique}.${ext}`;
}

/**
 * Process and upload one or many Multer files to ImageKit.
 * - Validates size (<=3MB) and mime type (jpeg/jpg/png/webp)
 * - Converts to lossless webp when source is not webp
 * - Uploads to ImageKit and returns the hosted URLs
 */
export async function processAndUploadImages(input, options) {
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
