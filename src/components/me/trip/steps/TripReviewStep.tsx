"use client";

import type { Photo } from "@/src/types";
import type { PlacePhotoFiles } from "@/src/components/me/trip/types";
import type { TripStepFormValues } from "@/src/schemas/tripForm";
import { formatDate } from "@/src/utils/dateFormat";

type TripReviewStepProps = {
  values: TripStepFormValues;
  existingTripPhotos: Photo[];
  selectedPhotoFiles: File[];
  placePhotoFiles: PlacePhotoFiles;
};

export function TripReviewStep({
  values,
  existingTripPhotos,
  selectedPhotoFiles,
  placePhotoFiles,
}: TripReviewStepProps) {
  const tripPhotoCount = existingTripPhotos.length + selectedPhotoFiles.length;
  const attractionPhotoCount = values.attractions.reduce(
    (total, place, index) =>
      total +
      place.photos.length +
      (placePhotoFiles.attractions[index]?.length ?? 0),
    0,
  );
  const cafePhotoCount = values.cafes.reduce(
    (total, place, index) =>
      total + place.photos.length + (placePhotoFiles.cafes[index]?.length ?? 0),
    0,
  );

  return (
    <div className="overflow-y-auto">
      <dl className="grid min-w-0 gap-3 text-small sm:grid-cols-2">
        <div>
          <dt className="text-small text-slate-500">Trip</dt>
          <dd className="text-standard wrap-break-word text-slate-800">
            {values.title}
          </dd>
        </div>
        <div>
          <dt className="text-small text-slate-500">Location</dt>
          <dd className="text-standard wrap-break-word text-slate-800">
            {[values.city, values.country].filter(Boolean).join(", ") || "-"}
          </dd>
        </div>
        <div>
          <dt className="text-small text-slate-500">Dates</dt>
          <dd className="text-standard text-slate-800">
            {formatDate(values.startDate)} - {formatDate(values.endDate)}
          </dd>
        </div>
        <div>
          <dt className="text-small text-slate-500">Places</dt>
          <dd className="text-standard text-slate-800">
            {values.attractions.length} attractions, {values.cafes.length} cafes
          </dd>
        </div>
        <div>
          <dt className="text-small text-slate-500">Photos</dt>
          <dd className="text-standard text-slate-800">
            {tripPhotoCount} trip, {attractionPhotoCount} attraction,{" "}
            {cafePhotoCount} cafe
          </dd>
        </div>
      </dl>
    </div>
  );
}
