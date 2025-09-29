import multer from "multer";

const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  if (allowedMimes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPEG, JPG, PNG, and WEBP images are allowed"));
};

export const upload = multer({ 
  storage, 
  fileFilter, 
  limits: { fileSize: 3 * 1024 * 1024, files: 3 } // 3 MB max, 3 files max
});

export const processUploads = async (req, _res, next) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    if (!files.length) return next();

    // Since we're removing imageUpload.js, just pass empty array or handle differently
    // You'll need to implement your own upload logic here
    req.uploadedImageUrls = [];
    next();
  } catch (err) {
    next(err);
  }
};
