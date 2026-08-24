"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, TextArea, TextField } from "@radix-ui/themes";
import { X } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { ConfirmDialog } from "@/src/components/common/ConfirmDialog";
import { ErrorText } from "@/src/components/common/ErrorText";
import { PhotoUploadField } from "@/src/components/me/trip/steps/PhotoUploadField";
import { placeFormSchema, type PlaceFormValues } from "@/src/schemas/tripForm";
import type { Photo } from "@/src/types";

const invalidFieldClassName = "ring-1 ring-red-500";

type PlaceEditorDialogProps = {
  open: boolean;
  mode: "add" | "edit";
  itemLabel: "attraction" | "cafe";
  initialValues: PlaceFormValues;
  existingPhotos?: Photo[];
  files: File[];
  onFilesChange: (files: File[]) => void;
  onOpenChange: (open: boolean) => void;
  onSave: (values: PlaceFormValues) => boolean;
  onDiscardFiles: () => void;
};

export function PlaceEditorDialog({
  open,
  mode,
  itemLabel,
  initialValues,
  files,
  onFilesChange,
  onOpenChange,
  onSave,
  onDiscardFiles,
}: PlaceEditorDialogProps) {
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<PlaceFormValues>({
    mode: "onSubmit",
    resolver: zodResolver(placeFormSchema),
    defaultValues: initialValues,
  });
  const placePhotos = useWatch({ control, name: "photos" });

  const requestClose = () => {
    if (isDirty) {
      setShowDiscardConfirm(true);
      return;
    }

    onOpenChange(false);
  };

  const discardChanges = () => {
    onDiscardFiles();
    reset(initialValues);
    setShowDiscardConfirm(false);
    onOpenChange(false);
  };

  const submit = (values: PlaceFormValues) => {
    if (!onSave(values)) {
      setError("name", {
        type: "duplicate",
        message: `${itemLabel} names must be unique`,
      });
      return;
    }

    reset(values);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Content maxWidth="560px">
          <div className="flex justify-between">
            <Dialog.Title>
              {mode === "add" ? `Add ${itemLabel}` : `Edit ${itemLabel}`}
            </Dialog.Title>

            <Dialog.Close
              onClick={(event) => {
                event.preventDefault();
                requestClose();
              }}
              className="absolute right-3 top-3"
            >
              <Button type="button" variant="ghost" size="1" aria-label="Close">
                <X size={18} />
              </Button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(submit)} className="mt-4 space-y-4">
            <div className="space-y-2">
              <TextField.Root
                color={errors.name ? "red" : undefined}
                {...register("name")}
                placeholder={`Write ${itemLabel} name`}
                className={errors.name ? invalidFieldClassName : undefined}
              />
              {errors.name && <ErrorText error={errors.name.message} />}

              <TextArea
                rows={3}
                {...register("note")}
                placeholder="Optional note"
                className={errors.note ? invalidFieldClassName : undefined}
              />
              {errors.note && <ErrorText error={errors.note.message} />}
            </div>

            <PhotoUploadField
              files={files}
              onFilesChange={onFilesChange}
              existingPhotos={placePhotos}
              onExistingPhotoDelete={(photoId) =>
                setValue(
                  "photos",
                  placePhotos.filter((photo) => photo.id !== photoId),
                  { shouldDirty: true },
                )
              }
            />

            <div className="flex justify-end gap-2 border-t pt-4">
              <Button
                type="button"
                variant="soft"
                color="gray"
                onClick={requestClose}
              >
                Cancel
              </Button>
              <Button type="submit">
                {mode === "add" ? `Add ${itemLabel}` : "Save changes"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Root>

      <ConfirmDialog
        open={showDiscardConfirm}
        onOpenChange={setShowDiscardConfirm}
        title="Discard changes?"
        description="The place draft will be discarded."
        confirmLabel="Discard"
        cancelLabel="Keep editing"
        confirmColor="gray"
        onConfirm={discardChanges}
      />
    </>
  );
}
