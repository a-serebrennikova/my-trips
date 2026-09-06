import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type UploadImageOptions = {
  folder: string;
  publicId?: string;
};

export type UploadedCloudinaryImage = {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
};

type CloudinaryUploadResponse = {
  secure_url?: string;
  public_id?: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
};

export async function uploadImageToCloudinary(
  file: File,
  { folder, publicId = crypto.randomUUID() }: UploadImageOptions,
): Promise<UploadedCloudinaryImage> {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { folder, public_id: publicId, timestamp },
    process.env.CLOUDINARY_API_SECRET || "",
  );
  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", process.env.CLOUDINARY_API_KEY || "");
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);
  formData.append("public_id", publicId);

  let response: Response;
  try {
    response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData },
    );
  } catch (error) {
    throw new Error(
      `Cloudinary network error: ${error instanceof Error ? error.message : "Unknown fetch error"}`,
    );
  }

  const responseText = await response.text();
  if (!response.ok) {
    throw new Error(
      `Failed to upload image to Cloudinary. Status: ${response.status}. Details: ${responseText}`,
    );
  }

  let result: CloudinaryUploadResponse;
  try {
    result = JSON.parse(responseText) as CloudinaryUploadResponse;
  } catch {
    throw new Error("Cloudinary returned invalid JSON.");
  }

  if (
    !result.secure_url ||
    !result.public_id ||
    !result.format ||
    result.bytes == null ||
    result.width == null ||
    result.height == null
  ) {
    throw new Error("Cloudinary returned incomplete image metadata.");
  }

  return {
    url: result.secure_url,
    publicId: result.public_id,
    format: result.format,
    bytes: result.bytes,
    width: result.width,
    height: result.height,
  };
}

export async function destroyCloudinaryImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (error) {
    console.error("[Cloudinary destroy] failed:", {
      publicId,
      error: error instanceof Error ? error.message : error,
    });
  }
}
