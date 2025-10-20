import multer from "multer";
import type { Request } from "express";

const ALLOWED_MIME_TYPES = new Set([
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
]);

const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024;

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
	if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
		return cb(null, true);
	}

	const err = new Error(
		"Only image files are allowed (jpg, jpeg, png, webp)."
	) as any;
	err.code = "LIMIT_FILE_TYPE";
	return cb(err, false);
};

const upload = multer({
	storage,
	limits: { fileSize: MAX_FILE_SIZE_BYTES },
	fileFilter,
});

export default upload;
export { MAX_FILE_SIZE_BYTES };
