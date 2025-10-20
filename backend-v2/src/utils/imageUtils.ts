import sharp from "sharp";
import ImageKit from "imagekit";

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});

const ALLOWED_MIMES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

async function convertToWebpBuffer(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer).webp({ lossless: true }).toBuffer();
}

export const processAndUploadImages = async (files: Express.Multer.File | Express.Multer.File[]): Promise<string | string[]> => {
  if (!files) return [];

  let fileArray = Array.isArray(files) ? files : [files];

  const uploadPromises = fileArray.map(async (file) => {
    if (!file || !file.mimetype || !file.buffer) {
      throw new Error("Invalid file object");
    }

    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      throw new Error(`Unsupported file type: ${file.mimetype}`);
    }

    let uploadBuffer = file.buffer;
    let extension = "webp";

    if (file.mimetype !== "image/webp") {
      uploadBuffer = await convertToWebpBuffer(file.buffer);
      extension = "webp";
    }

    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}.${extension}`;

    const response = await imageKit.upload({
      file: uploadBuffer,
      fileName,
    });

    return response.url;
  });

  const urls = await Promise.all(uploadPromises);

  return Array.isArray(files) ? urls : urls[0];
};

export default processAndUploadImages;
