"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { ConfirmDialog } from "@/src/components/common/ConfirmDialog";
import { notifyError } from "@/src/components/common/Notification/notificationBus";
import { PlacesStep } from "@/src/components/me/trip/steps/PlacesStep";
import { PhotoUploadField } from "@/src/components/me/trip/steps/PhotoUploadField";
import { TripReviewStep } from "@/src/components/me/trip/steps/TripReviewStep";
import { TripDetailsStep } from "@/src/components/me/trip/steps/TripDetailsStep";
import { TripFormActions } from "@/src/components/me/trip/form/TripFormActions";
import {
  TripStepIndicator,
  tripStepLabels,
} from "@/src/components/me/trip/form/TripStepIndicator";
import { useTripWizard } from "@/src/components/me/trip/hooks/useTripWizard";
import { usePlacePhotoFiles } from "@/src/components/me/trip/hooks/usePlacePhotoFiles";
import {
  cleanupUploadedTripPhoto,
  uploadTripPhoto,
  upsertTrip,
} from "@/src/service/tripService";
import {
  type TripStepFormValues,
  tripStepFormSchema,
} from "@/src/schemas/tripForm";
import type { Photo } from "@/src/types";
import type { UploadedPhotoMetadata } from "@/src/components/me/trip/types";
import { Card } from "@/src/components/common/Card";

type TripStepFormProps = {
  mode?: "create" | "edit";
  tripId?: string;
  initialValues?: Partial<TripStepFormValues>;
  existingTripPhotos?: Photo[];
};

const defaultValues: TripStepFormValues = {
  title: "",
  city: "",
  country: "",
  startDate: "",
  endDate: "",
  approximateCost: 0,
  currency: "EUR",
  notes: "",
  attractions: [],
  cafes: [],
  tripPhotos: [],
};

const stepDescriptions = {
  "Trip details": "Fill in the basic trip information.",
  Attractions: "Add the places you want to remember.",
  Cafes: "Save the best cafés and coffee stops.",
  Photos: "Add trip photos and place photos later.",
  Review: "Check the summary before saving.",
};

export function TripStepForm({
  mode = "create",
  tripId,
  initialValues,
  existingTripPhotos = [],
}: TripStepFormProps) {
  const router = useRouter();
  const [selectedPhotoFiles, setSelectedPhotoFiles] = useState<File[]>([]);
  const [currentTripPhotos, setCurrentTripPhotos] =
    useState<Photo[]>(existingTripPhotos);
  const { placePhotoFiles, handlePlacePhotoFilesChange, handlePlaceDeleted } =
    usePlacePhotoFiles();
  const [uploadedPhotos, setUploadedPhotos] = useState(
    new Map<File, UploadedPhotoMetadata>(),
  );

  const {
    register,
    control,
    handleSubmit,
    trigger,
    setValue,
    clearErrors,
    getValues,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<TripStepFormValues>({
    mode: "onSubmit",
    shouldUnregister: false,
    resolver: zodResolver(tripStepFormSchema),
    defaultValues: { ...defaultValues, ...initialValues },
  });

  const {
    activeStep,
    showLeaveDialog,
    goToNextStep,
    goToPreviousStep,
    setActiveStep,
    handleLeaveWithoutSaving,
    openLeaveDialog,
    closeLeaveDialog,
  } = useTripWizard({
    validateCurrentStep: async () => {
      if (activeStep !== 0) {
        return true;
      }

      return await trigger([
        "title",
        "city",
        "country",
        "startDate",
        "endDate",
        "approximateCost",
        "currency",
        "notes",
      ]);
    },
  });

  const validateStepChange = async (
    _step: string,
    direction: "next" | "prev",
  ) => {
    if (direction !== "next" || activeStep !== 0) {
      return true;
    }

    return trigger([
      "title",
      "city",
      "country",
      "startDate",
      "endDate",
      "approximateCost",
      "currency",
      "notes",
    ]);
  };

  useEffect(() => {
    if (!isDirty && uploadedPhotos.size === 0) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty, uploadedPhotos.size]);

  const currentStep = tripStepLabels[activeStep];
  const isLastStep = activeStep === tripStepLabels.length - 1;

  const handleCancel = () => {
    const nextRoute =
      mode === "create" ? "/me" : tripId ? `/trips/${tripId}` : "/me";

    if (!isDirty) {
      router.push(nextRoute);
      return;
    }

    openLeaveDialog(nextRoute);
  };

  const handleTripPhotoDelete = (photoId: string) => {
    const remainingPhotos = currentTripPhotos.filter(
      (photo) => photo.id !== photoId,
    );
    setCurrentTripPhotos(remainingPhotos);
    setValue(
      "tripPhotos",
      getValues("tripPhotos").filter((photo) => photo.id !== photoId),
      { shouldDirty: true },
    );
  };

  const uploadPhotoFiles = async (
    files: File[],
    uploadCache: Map<File, UploadedPhotoMetadata>,
    sortOffset = 0,
  ) => {
    const result = new Array<UploadedPhotoMetadata & { sortOrder: number }>(
      files.length,
    );
    const pendingIndexes = files
      .map((file, index) => ({ file, index }))
      .filter(({ file }) => !uploadCache.has(file));
    let nextIndex = 0;

    const uploadNext = async () => {
      while (nextIndex < pendingIndexes.length) {
        const current = pendingIndexes[nextIndex++];
        const uploaded = await uploadTripPhoto(current.file);
        uploadCache.set(current.file, uploaded);
        result[current.index] = {
          ...uploaded,
          sortOrder: sortOffset + current.index,
        };
      }
    };

    await Promise.all(
      Array.from({ length: Math.min(3, pendingIndexes.length) }, uploadNext),
    );

    files.forEach((file, index) => {
      const uploaded = uploadCache.get(file);
      if (uploaded) {
        result[index] = { ...uploaded, sortOrder: sortOffset + index };
      }
    });

    return result;
  };

  const cleanupUploadedPhotos = async () => {
    const photos = Array.from(uploadedPhotos.values());
    await Promise.all(
      photos.map((photo) => cleanupUploadedTripPhoto(photo.publicId)),
    );
    setUploadedPhotos(new Map());
  };

  const onSubmit = async (values: TripStepFormValues) => {
    const uploadCache = new Map(uploadedPhotos);

    try {
      const uploadedTripPhotos = await uploadPhotoFiles(
        selectedPhotoFiles,
        uploadCache,
        values.tripPhotos.length,
      );
      const uploadPlacePhotos = async (
        place: TripStepFormValues["attractions"][number],
        index: number,
        collection: "attractions" | "cafes",
      ) => {
        const files = placePhotoFiles[collection][index] ?? [];
        const uploadedPhotos = await uploadPhotoFiles(
          files,
          uploadCache,
          place.photos.length,
        );

        return {
          ...place,
          photos: [...place.photos, ...uploadedPhotos],
        };
      };
      const attractions: TripStepFormValues["attractions"] = [];
      for (const [index, place] of values.attractions.entries()) {
        attractions.push(await uploadPlacePhotos(place, index, "attractions"));
      }

      const cafes: TripStepFormValues["cafes"] = [];
      for (const [index, place] of values.cafes.entries()) {
        cafes.push(await uploadPlacePhotos(place, index, "cafes"));
      }

      const result = await upsertTrip(mode === "edit" ? tripId : undefined, {
        ...values,
        attractions,
        cafes,
        tripPhotos: [...values.tripPhotos, ...uploadedTripPhotos],
        notes: values.notes?.trim() ?? "",
      });

      setUploadedPhotos(new Map());
      router.push(`/trips/${result.id}`);
    } catch {
      setUploadedPhotos(uploadCache);
      notifyError("Failed to save trip");
    }
  };

  const formValues = getValues();

  return (
    <>
      <ConfirmDialog
        open={showLeaveDialog}
        onOpenChange={(open) => {
          if (!open) {
            closeLeaveDialog();
          }
        }}
        title="Leave without saving?"
        description="You have unsaved changes. Are you sure you want to leave this page?"
        confirmLabel="Leave without saving"
        cancelLabel="Stay on page"
        confirmColor="gray"
        onConfirm={() => {
          handleLeaveWithoutSaving(() => {
            void cleanupUploadedPhotos().finally(() => {
              router.push(
                mode === "create" ? "/me" : tripId ? `/trips/${tripId}` : "/me",
              );
            });
          });
        }}
      />

      <Card className="flex min-h-0 w-full flex-1 self-center max-w-4xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-small uppercase text-teal-600">
            {mode === "edit" ? "Edit trip" : "Create trip"}
          </p>
          <h1 className="page-title">
            {mode === "edit" ? "Trip details" : "New trip"}
          </h1>
        </header>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="hidden mb-4 sm:block">
            <TripStepIndicator
              activeStep={activeStep}
              onStepChange={setActiveStep}
              onValidate={validateStepChange}
            />
          </div>

          <p className="text-standard">{stepDescriptions[currentStep]}</p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-5 flex min-h-0 flex-1 flex-col gap-5"
          >
            {activeStep === 0 && (
              <TripDetailsStep
                register={register}
                control={control}
                errors={errors}
              />
            )}

            {activeStep === 1 && (
              <PhotoUploadField
                files={selectedPhotoFiles}
                onFilesChange={setSelectedPhotoFiles}
                existingPhotos={currentTripPhotos}
                onExistingPhotoDelete={handleTripPhotoDelete}
              />
            )}

            {activeStep === 2 && (
              <PlacesStep
                control={control}
                name="attractions"
                label="Attractions"
                itemLabel="attraction"
                setValue={setValue}
                clearErrors={clearErrors}
                photoFilesByIndex={placePhotoFiles.attractions}
                onPhotoFilesChange={(index, files) =>
                  handlePlacePhotoFilesChange("attractions", index, files)
                }
                onPlaceDeleted={(index) =>
                  handlePlaceDeleted("attractions", index)
                }
              />
            )}

            {activeStep === 3 && (
              <PlacesStep
                control={control}
                name="cafes"
                label="Cafes"
                itemLabel="cafe"
                setValue={setValue}
                clearErrors={clearErrors}
                photoFilesByIndex={placePhotoFiles.cafes}
                onPhotoFilesChange={(index, files) =>
                  handlePlacePhotoFilesChange("cafes", index, files)
                }
                onPlaceDeleted={(index) => handlePlaceDeleted("cafes", index)}
              />
            )}

            {activeStep === 4 && (
              <TripReviewStep
                values={formValues}
                existingTripPhotos={currentTripPhotos}
                selectedPhotoFiles={selectedPhotoFiles}
                placePhotoFiles={placePhotoFiles}
              />
            )}

            <TripFormActions
              isFirstStep={activeStep === 0}
              isLastStep={isLastStep}
              isSubmitting={isSubmitting}
              submitLabel={mode === "edit" ? "Save" : "Create"}
              onCancel={handleCancel}
              onPrevious={goToPreviousStep}
              onNext={goToNextStep}
            />
          </form>
        </div>
      </Card>
    </>
  );
}
