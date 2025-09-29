import multer from "multer";

// Allowed image mime types
const ALLOWED_MIME_TYPES = new Set([
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
]);

// 3 MB per file
const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024;

// Keep files in memory; downstream can persist (e.g., to cloud) if needed
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
	if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
		return cb(null, true);
	}

	// Reject non-image files
	const err = new Error(
		"Only image files are allowed (jpg, jpeg, png, webp)."
	);
	err.code = "LIMIT_FILE_TYPE"; // custom code for downstream error handling
	return cb(err, false);
};

const upload = multer({
	storage,
	limits: { fileSize: MAX_FILE_SIZE_BYTES },
	fileFilter,
});

export default upload;
export { MAX_FILE_SIZE_BYTES };
