import { requestJson, requestVoid } from "./request";

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

export async function upsertTrip(
	tripId: string | undefined,
	payload: unknown,
) {
	return requestVoid(tripId ? `/api/travel/trips/${tripId}` : "/api/travel/trips", {
		method: tripId ? "PATCH" : "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
		errorMessage: tripId ? "Failed to update trip" : "Failed to create trip",
	});
}

export async function deleteTrip(tripId: string) {
	return requestVoid(`/api/travel/trips/${tripId}`, {
		method: "DELETE",
		errorMessage: "Failed to delete trip",
	});
}