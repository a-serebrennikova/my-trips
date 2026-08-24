import { requestJson, requestVoid } from "./request";
import type { UploadedPhotoMetadata } from "@/src/components/me/trip/types";

export async function uploadTripPhoto(
  file: File,
): Promise<UploadedPhotoMetadata> {
  const formData = new FormData();
  formData.append("file", file);

  return requestJson<UploadedPhotoMetadata>("/api/travel/uploads", {
    method: "POST",
    body: formData,
    errorMessage: "Failed to upload photo",
  });
}

export async function cleanupUploadedTripPhoto(
  publicId: string,
): Promise<void> {
  return requestVoid("/api/travel/uploads", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ publicId }),
    errorMessage: "Failed to clean up uploaded photo",
  });
}

export async function toggleTripLike(tripId: string, signal?: AbortSignal) {
  return requestJson<{ likedByUserIds: string[] }>(
    `/api/travel/trips/${tripId}/like`,
    {
      method: "POST",
      signal,
      errorMessage: "Failed to toggle like",
    },
  );
}

export async function createTripComment(
  tripId: string,
  content: string,
  signal?: AbortSignal,
) {
  return requestJson<{ comments: { id: string; content: string }[] }>(
    `/api/travel/trips/${tripId}/comment`,
    {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
      errorMessage: "Failed to create comment",
    },
  );
}

export async function deleteTripComment(
  tripId: string,
  commentId: string,
  signal?: AbortSignal,
) {
  return requestVoid(`/api/travel/trips/${tripId}/comment/${commentId}`, {
    method: "DELETE",
    signal,
    errorMessage: "Failed to delete comment",
  });
}

export async function upsertTrip(tripId: string | undefined, payload: unknown) {
  return requestJson<{ id: string }>(
    tripId ? `/api/travel/trips/${tripId}` : "/api/travel/trips",
    {
      method: tripId ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      errorMessage: tripId ? "Failed to update trip" : "Failed to create trip",
    },
  );
}

export async function deleteTrip(tripId: string) {
  return requestVoid(`/api/travel/trips/${tripId}`, {
    method: "DELETE",
    errorMessage: "Failed to delete trip",
  });
}
