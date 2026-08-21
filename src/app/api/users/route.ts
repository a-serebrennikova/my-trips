import { v2 as cloudinary } from "cloudinary";

import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getCurrentUserId } from "@/src/auth/session";
import { getUsers, updateUserProfile } from "@/src/db/users";
import { MAX_AVATAR_SIZE_BYTES } from "@/src/consts/images";
import { User } from "@/src/types";
import {
  buildProfileUpdateFromRecord,
  isRecord,
} from "@/src/service/profileService";

export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error("[GET /api/users]", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        ...(process.env.NODE_ENV !== "production" &&
          error instanceof Error && { details: error.message }),
      },
      { status: 500 },
    );
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadAvatarToCloudinary(
  file: File,
): Promise<string | null> {
  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = crypto.randomUUID();

  const signature = cloudinary.utils.api_sign_request(
    { folder: "avatars", public_id: publicId, timestamp },
    process.env.CLOUDINARY_API_SECRET || "",
  );

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", process.env.CLOUDINARY_API_KEY || "");
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", "avatars");
  formData.append("public_id", publicId);

  let response: Response;

  try {
    response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );
  } catch (error) {
    console.error("[Cloudinary upload] network error:", error);
    throw new Error(
      `Cloudinary network error: ${error instanceof Error ? error.message : "Unknown fetch error"}`,
    );
  }

  const responseText = await response.text();

  if (!response.ok) {
    console.error("[Cloudinary upload] failed response:", {
      status: response.status,
      statusText: response.statusText,
      body: responseText,
    });
    throw new Error(
      `Failed to upload avatar to Cloudinary. Status: ${response.status}. Details: ${responseText}`,
    );
  }

  let result: { secure_url?: string };
  try {
    result = JSON.parse(responseText) as { secure_url?: string };
  } catch {
    console.error("[Cloudinary upload] invalid JSON response:", responseText);
    throw new Error("Cloudinary returned invalid JSON.");
  }

  return result.secure_url ?? null;
}

export async function PATCH(request: Request) {
  try {
    const currentUserId = await getCurrentUserId();

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type") || "";
    let profileUpdate: Partial<User> = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("avatar");

      Object.assign(
        profileUpdate,
        buildProfileUpdateFromRecord({
          name: formData.get("name"),
          email: formData.get("email"),
          homeCity: formData.get("homeCity"),
        }),
      );

      if (file instanceof File) {
        if (file.size > MAX_AVATAR_SIZE_BYTES) {
          return NextResponse.json(
            { error: "Image is too large. Maximum size is 2 MB." },
            { status: 400 },
          );
        }

        const avatarUrl = await uploadAvatarToCloudinary(file);

        if (!avatarUrl) {
          return NextResponse.json(
            { error: "Cloudinary returned no avatar URL." },
            { status: 500 },
          );
        }

        profileUpdate.avatarUrl = avatarUrl;
      }
    } else {
      const body = await request.json().catch(() => null);

      if (!isRecord(body)) {
        return NextResponse.json(
          { error: "Request body is required." },
          { status: 400 },
        );
      }

      profileUpdate = buildProfileUpdateFromRecord(body);
    }

    if (Object.keys(profileUpdate).length === 0) {
      return NextResponse.json(
        { error: "No profile fields were provided." },
        { status: 400 },
      );
    }

    const user = await updateUserProfile(currentUserId, profileUpdate);

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    revalidateTag("friend-profile-data", "default");
    revalidateTag("friends-summary", "default");
    revalidateTag("all-travel-data", "default");
    revalidateTag("trip-by-id", "default");
    revalidatePath("/");
    revalidatePath("/me");
    revalidatePath("/trips");
    revalidatePath("/users");
    revalidatePath(`/users/${currentUserId}`);

    return NextResponse.json({ user, avatarUrl: user.avatarUrl ?? null });
  } catch (error) {
    console.error("[PATCH /api/users]", error);
    return NextResponse.json(
      {
        error: "Failed to update user profile.",
        ...(process.env.NODE_ENV !== "production" &&
          error instanceof Error && { details: error.message }),
      },
      { status: 500 },
    );
  }
}
