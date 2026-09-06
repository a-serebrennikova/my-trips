"use client";

import { useState } from "react";

import type {
  PlaceCollection,
  PlacePhotoFiles,
} from "@/src/components/me/trip/types";

export function usePlacePhotoFiles() {
  const [placePhotoFiles, setPlacePhotoFiles] = useState<PlacePhotoFiles>({
    attractions: {},
    cafes: {},
  });

  const handlePlacePhotoFilesChange = (
    collection: PlaceCollection,
    index: number,
    files: File[],
  ) => {
    setPlacePhotoFiles((previous) => ({
      ...previous,
      [collection]: { ...previous[collection], [index]: files },
    }));
  };

  const handlePlaceDeleted = (
    collection: PlaceCollection,
    deletedIndex: number,
  ) => {
    setPlacePhotoFiles((previous) => {
      const next: Record<number, File[]> = {};

      Object.entries(previous[collection]).forEach(([index, files]) => {
        const numericIndex = Number(index);
        if (numericIndex < deletedIndex) next[numericIndex] = files;
        if (numericIndex > deletedIndex) next[numericIndex - 1] = files;
      });

      return { ...previous, [collection]: next };
    });
  };

  return {
    placePhotoFiles,
    handlePlacePhotoFilesChange,
    handlePlaceDeleted,
  };
}
