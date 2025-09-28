import multer from "multer";
import { allowedMimes, processAndUploadImages } from "@/utils/imageUpload";

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if ((allowedMimes as ReadonlyArray<string>).includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPEG, JPG, PNG, and WEBP images are allowed"));
};

export const upload = multer({ 
  storage, 
  fileFilter, 
  limits: { fileSize: 3 * 1024 * 1024, files: 3 } // 3 MB max, 3 files max
});

export const processUploads = async (req: Express.Request, _res: Express.Response, next: Function) => {
  try {
    const files = (req.files as Express.Multer.File[]) || (req.file ? [req.file] : []);
    if (!files.length) return next();

    const urls = await processAndUploadImages(files, { folder: "/beaded/uploads" });

    (req as any).uploadedImageUrls = urls;
    next();
  } catch (err) {
    next(err);
  }
};
