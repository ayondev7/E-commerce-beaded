import multer from "multer";
import sharp from "sharp";
import { uploadToImageKit } from "@/lib/imagekit";

const storage = multer.memoryStorage();

const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (allowedMimes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPEG, JPG, PNG, and WEBP images are allowed"));
};

export const upload = multer({ 
  storage, 
  fileFilter, 
  limits: { fileSize: 3 * 1024 * 1024, files: 3 } // 3 MB max, 3 files max
});

export const processUploads = async (req: Express.Request, _res: Express.Response, next: Function) => {
  try {
    const files = (req.files as Express.Multer.File[]) || [];
    if (!files.length) return next();

    const urls = await Promise.all(
      files.map(async (file) => {
        let buffer = file.buffer;

        if (file.mimetype !== "image/webp") {
          buffer = await sharp(buffer)
            .webp({ lossless: true })
            .toBuffer();
        }

        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const name = `${unique}.webp`;

        return uploadToImageKit({ file: buffer, fileName: name, folder: "/beaded/uploads" });
      })
    );

    (req as any).uploadedImageUrls = urls;
    next();
  } catch (err) {
    next(err);
  }
};
