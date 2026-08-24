export const runtime = "nodejs";

import { NextResponse } from "next/server";

import { getCurrentUserId } from "@/src/auth/session";
import {
  destroyCloudinaryImage,
  uploadImageToCloudinary,
} from "@/src/service/cloudinary";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function errorResponse(error: unknown, status = 500) {
  return NextResponse.json(
    {
      error: "Image upload failed",
      ...(process.env.NODE_ENV !== "production" &&
        error instanceof Error && { details: error.message }),
    },
    { status },
  );
}

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return errorResponse(new Error("A single file is required."), 400);
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return errorResponse(
        new Error("Only JPEG, PNG, and WebP images are allowed."),
        400,
      );
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return errorResponse(new Error("Image size cannot exceed 5 MB."), 400);
    }

    const photoId = crypto.randomUUID();
    const uploaded = await uploadImageToCloudinary(file, {
      folder: `trips/${userId}`,
      publicId: photoId,
    });

    return NextResponse.json(
      {
        id: photoId,
        ...uploaded,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/travel/uploads]", error);
    return errorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json().catch(() => null)) as {
      publicId?: unknown;
    } | null;
    const publicId = typeof body?.publicId === "string" ? body.publicId : "";
    const prefix = `trips/${userId}/`;
    const assetId = publicId.slice(prefix.length);

    if (
      !publicId.startsWith(prefix) ||
      !assetId ||
      assetId.includes("/") ||
      assetId.includes("..")
    ) {
      return errorResponse(new Error("Invalid asset ownership."), 403);
    }

    await destroyCloudinaryImage(publicId);
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("[DELETE /api/travel/uploads]", error);
    return errorResponse(error);
  }
}
