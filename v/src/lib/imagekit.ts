import ImageKit from "imagekit";
import { env } from "@/config/env";

export const imagekit = new ImageKit({
  publicKey: env.IMAGEKIT_PUBLIC_KEY,
  privateKey: env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: env.IMAGEKIT_URL_ENDPOINT
});

export async function uploadToImageKit(params: {
  file: Buffer | string;
  fileName: string;
  folder?: string;
}) {
  const { file, fileName, folder } = params;
  const res = await imagekit.upload({
    file,
    fileName,
    folder
  });
  return res.url;
}
