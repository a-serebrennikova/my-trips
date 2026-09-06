export type UploadedPhotoMetadata = {
  id: string;
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
};

export type PlaceCollection = "attractions" | "cafes";

export type PlacePhotoFiles = Record<PlaceCollection, Record<number, File[]>>;
