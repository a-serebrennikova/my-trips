"use client";

import {
  FileUpload,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
  type FileUploadProps,
} from "@/components/ui/file-upload";
import { Button } from "@radix-ui/themes";
import { X } from "lucide-react";
import Image from "next/image";
import { formatBytes } from "@/src/utils/formatBytes";

import { notifyError } from "@/src/components/common/Notification/notificationBus";
import type { Photo } from "@/src/types";

const MAX_PHOTOS = 3;
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

type PhotoUploadFieldProps = {
  files: File[];
  onFilesChange: (files: File[]) => void;
  existingPhotos?: Photo[];
  onExistingPhotoDelete?: (photoId: string) => void;
};

export function PhotoUploadField({
  files,
  onFilesChange,
  existingPhotos = [],
  onExistingPhotoDelete,
}: PhotoUploadFieldProps) {
  const remainingSlots = Math.max(0, MAX_PHOTOS - existingPhotos.length);
  const isDisabledAddButton = !(
    remainingSlots > 0 && files.length < remainingSlots
  );

  const handleFileReject: FileUploadProps["onFileReject"] = (_, message) => {
    notifyError(message);
  };

  return (
    <div className="flex flex-col gap-3">
      <FileUpload
        value={files}
        onValueChange={onFilesChange}
        onFileReject={handleFileReject}
        onFileValidate={(file) =>
          allowedTypes.has(file.type)
            ? undefined
            : "Only JPEG, PNG, and WebP images are allowed"
        }
        accept="image/jpeg,image/png,image/webp"
        maxFiles={remainingSlots}
        maxSize={MAX_PHOTO_SIZE}
        multiple
      >
        <FileUploadTrigger asChild>
          <Button
            style={{ width: "125px" }}
            type="button"
            variant="soft"
            color={isDisabledAddButton ? "gray" : "green"}
            className="photo-upload-add-button"
            disabled={isDisabledAddButton}
          >
            Add photo
          </Button>
        </FileUploadTrigger>

        <FileUploadList>
          {files.map((file, index) => (
            <FileUploadItem
              key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
              value={file}
              className="photo-upload-card"
            >
              <FileUploadItemPreview />
              <FileUploadItemMetadata />
              <FileUploadItemDelete asChild>
                <Button type="button" variant="ghost" size="1" color="red">
                  <X size={16} />
                </Button>
              </FileUploadItemDelete>
            </FileUploadItem>
          ))}
        </FileUploadList>
      </FileUpload>
      {existingPhotos.length > 0 && (
        <div className="space-y-2">
          {existingPhotos.map((photo, index) => (
            <div key={`${photo.id}-${index}`} className="photo-upload-card">
              <Image
                src={photo.url}
                width={40}
                height={40}
                alt={`Saved photo ${index + 1}`}
                className="photo-upload-preview"
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-slate-800">
                  saved photo {index + 1}
                </span>
                <span className="truncate text-xs text-slate-500">
                  {photo.format.toUpperCase()} · {formatBytes(photo.bytes)}
                </span>
              </div>
              {onExistingPhotoDelete && (
                <Button
                  type="button"
                  variant="ghost"
                  size="1"
                  color="red"
                  className="shrink-0"
                  aria-label={`Delete saved photo ${index + 1}`}
                  title={`Delete saved photo ${index + 1}`}
                  onClick={() => onExistingPhotoDelete(photo.id)}
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
