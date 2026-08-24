"use client";

import { Button } from "@radix-ui/themes";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  useFieldArray,
  type Control,
  type UseFormClearErrors,
  type UseFormSetValue,
} from "react-hook-form";
import { ConfirmDialog } from "@/src/components/common/ConfirmDialog";
import { IconActionButton } from "@/src/components/common/IconActionButton";
import { Settings } from "@/src/components/common/icons/Settings";
import { Trash } from "@/src/components/common/icons/Trash";
import { PlaceEditorDialog } from "@/src/components/me/trip/steps/PlaceEditorDialog";
import {
  type PlaceFormValues,
  type TripStepFormValues,
} from "@/src/schemas/tripForm";
import type { PlaceCollection } from "@/src/components/me/trip/types";

const MAX_PLACES = 3;

type PlacesStepProps = {
  control: Control<TripStepFormValues>;
  name: PlaceCollection;
  label: "Attractions" | "Cafes";
  itemLabel: "attraction" | "cafe";
  setValue: UseFormSetValue<TripStepFormValues>;
  clearErrors: UseFormClearErrors<TripStepFormValues>;
  photoFilesByIndex: Record<number, File[]>;
  onPhotoFilesChange: (index: number, files: File[]) => void;
  onPlaceDeleted: (index: number) => void;
};

export function PlacesStep({
  control,
  name,
  label,
  itemLabel,
  setValue,
  clearErrors,
  photoFilesByIndex,
  onPhotoFilesChange,
  onPlaceDeleted,
}: PlacesStepProps) {
  const { fields, append, update, remove } = useFieldArray({
    control,
    name,
    keyName: "fieldKey",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(
    null,
  );

  const openAddEditor = () => {
    setEditingIndex(null);
    setIsEditorOpen(true);
  };

  const openEditEditor = (index: number) => {
    setEditingIndex(index);
    setIsEditorOpen(true);
  };

  const currentIndex = editingIndex ?? fields.length;
  const initialValues =
    editingIndex === null
      ? { name: "", note: "", photos: [], sortOrder: fields.length }
      : {
          id: fields[editingIndex].id,
          name: fields[editingIndex].name,
          note: fields[editingIndex].note ?? "",
          photos: fields[editingIndex].photos,
          sortOrder: editingIndex,
        };

  const savePlace = (values: PlaceFormValues) => {
    const duplicate = fields.some((field, index) => {
      if (editingIndex !== null && index === editingIndex) return false;
      return field.name.trim().toLowerCase() === values.name.toLowerCase();
    });

    if (duplicate) return false;

    if (editingIndex === null) {
      append(values);
    } else {
      update(editingIndex, values);
    }

    setIsEditorOpen(false);
    setEditingIndex(null);
    clearErrors(name);
    return true;
  };

  const requestDelete = (index: number) => {
    setPendingDeleteIndex(index);
    setShowDeleteConfirm(true);
  };

  const deletePlace = () => {
    if (pendingDeleteIndex === null) return;

    const index = pendingDeleteIndex;
    remove(index);
    onPlaceDeleted(index);
    setValue(
      name,
      fields
        .filter((_, itemIndex) => itemIndex !== index)
        .map((item, itemIndex) => ({
          ...item,
          sortOrder: itemIndex,
        })),
      { shouldDirty: true },
    );
    setPendingDeleteIndex(null);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-end gap-3">
        <div className="flex items-center gap-2">
          <span className="text-small text-slate-500">
            {fields.length}/{MAX_PLACES}
          </span>
          <Button
            type="button"
            variant="soft"
            color="green"
            onClick={openAddEditor}
            disabled={fields.length >= MAX_PLACES}
            aria-label={`Add ${itemLabel}`}
            title={`Add ${itemLabel}`}
          >
            <Plus size={18} />
          </Button>
        </div>
      </div>

      {fields.length === 0 ? (
        <div className="flex-1">No {label.toLowerCase()} added yet.</div>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.fieldKey}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-standard">{field.name}</p>
                  {field.note ? (
                    <p className="mt-1 text-small text-slate-600">
                      {field.note}
                    </p>
                  ) : (
                    <p className="mt-1 text-small text-slate-400">No note</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <IconActionButton
                    ariaLabel={`Edit ${itemLabel}`}
                    onClick={() => openEditEditor(index)}
                    title={`Edit ${itemLabel}`}
                    variant="soft"
                    color="gray"
                  >
                    <Settings />
                  </IconActionButton>
                  <IconActionButton
                    ariaLabel={`Delete ${itemLabel}`}
                    onClick={() => requestDelete(index)}
                    title={`Delete ${itemLabel}`}
                    variant="soft"
                    color="red"
                  >
                    <Trash />
                  </IconActionButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isEditorOpen && (
        <>
          <PlaceEditorDialog
            open={isEditorOpen}
            mode={editingIndex === null ? "add" : "edit"}
            itemLabel={itemLabel}
            initialValues={initialValues}
            existingPhotos={
              editingIndex === null ? [] : fields[editingIndex].photos
            }
            files={photoFilesByIndex[currentIndex] ?? []}
            onFilesChange={(files) => onPhotoFilesChange(currentIndex, files)}
            onOpenChange={setIsEditorOpen}
            onSave={savePlace}
            onDiscardFiles={() => onPhotoFilesChange(currentIndex, [])}
          />
          <ConfirmDialog
            open={showDeleteConfirm}
            onOpenChange={setShowDeleteConfirm}
            title={`Delete ${itemLabel}?`}
            description="This place and its photos will be removed from the form."
            confirmLabel="Delete"
            onConfirm={deletePlace}
          />
        </>
      )}
    </div>
  );
}
