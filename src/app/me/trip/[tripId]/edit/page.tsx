import { notFound } from "next/navigation";

import { getCurrentUserId } from "@/src/auth/session";
import { GuestAccessState } from "@/src/components/auth/GuestAccessState";
import { TripStepForm } from "@/src/components/me/trip/form/TripStepForm";
import { getTripById } from "@/src/db/trips";

export default async function EditTripPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    return <GuestAccessState />;
  }

  const trip = await getTripById(tripId);

  if (!trip || trip.userId !== currentUserId) {
    notFound();
  }

  return (
    <TripStepForm
      mode="edit"
      tripId={tripId}
      existingTripPhotos={trip.photos}
      initialValues={{
        title: trip.title,
        city: trip.city,
        country: trip.country,
        startDate: trip.startDate,
        endDate: trip.endDate,
        approximateCost: trip.approximateCost,
        currency: trip.currency,
        notes: trip.notes ?? "",
        attractions: trip.attractions.map((place, sortOrder) => ({
          id: place.id,
          name: place.name,
          note: place.note ?? "",
          photos: place.photos.map((photo) => ({
            id: photo.id,
            url: photo.url,
            publicId: photo.publicId,
            format: photo.format,
            bytes: photo.bytes,
            width: photo.width,
            height: photo.height,
            sortOrder: photo.sortOrder,
          })),
          sortOrder,
        })),
        cafes: trip.cafes.map((place, sortOrder) => ({
          id: place.id,
          name: place.name,
          note: place.note ?? "",
          photos: place.photos.map((photo) => ({
            id: photo.id,
            url: photo.url,
            publicId: photo.publicId,
            format: photo.format,
            bytes: photo.bytes,
            width: photo.width,
            height: photo.height,
            sortOrder: photo.sortOrder,
          })),
          sortOrder,
        })),
        tripPhotos: trip.photos.map((photo) => ({
          id: photo.id,
          url: photo.url,
          publicId: photo.publicId,
          format: photo.format,
          bytes: photo.bytes,
          width: photo.width,
          height: photo.height,
          sortOrder: photo.sortOrder,
        })),
      }}
    />
  );
}
