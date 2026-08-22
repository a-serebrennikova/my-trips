"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Flex,
  Select,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { CURRENCY } from "@/src/types";
import { type TripFormValues, tripFormSchema } from "@/src/schemas/tripForm";
import { upsertTrip } from "@/src/service/tripService";
import { Dialog } from "@radix-ui/themes";
import {
  notifyError,
  notifySuccess,
} from "@/src/components/common/Notification/notificationBus";
import { ErrorText } from "../common/ErrorText";

type CreateEditTripModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "create" | "edit";
  tripId?: string;
  initialValues?: Partial<TripFormValues>;
};

const defaultValues: TripFormValues = {
  title: "",
  city: "",
  country: "",
  startDate: "",
  endDate: "",
  approximateCost: 0,
  currency: "EUR",
  notes: "",
};

const invalidFieldClassName = "ring-1 ring-red-500";

export const CreateEditTripModal = ({
  open,
  onOpenChange,
  mode = "create",
  tripId,
  initialValues,
}: CreateEditTripModalProps) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<TripFormValues>({
    mode: "onSubmit",
    resolver: zodResolver(tripFormSchema),
    defaultValues: { ...defaultValues, ...initialValues },
  });

  const onSubmit = async (values: TripFormValues) => {
    if (!isDirty) {
      onOpenChange(false);
      return;
    }

    const payload = {
      ...values,
      notes: values.notes?.trim() ?? "",
    };

    try {
      await upsertTrip(mode === "edit" ? tripId : undefined, payload);

      if (mode === "create") {
        notifySuccess("Trip created successfully");
      }

      if (mode === "edit") {
        notifySuccess("Trip updated successfully");
      }

      onOpenChange(false);
      router.refresh();
    } catch {
      notifyError("Failed to create trip");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content maxWidth="560px">
        <Dialog.Title>
          {mode === "edit" ? "Edit Trip" : "Create New Trip"}
        </Dialog.Title>
        <Dialog.Description size="2" mb="4" className="text-slate-600">
          Fill out the trip details and submit.
        </Dialog.Description>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Text as="label" size="2" weight="medium" className="block">
              Title*
            </Text>
            <TextField.Root
              placeholder="Summer in Lisbon"
              color={errors.title ? "red" : undefined}
              {...register("title")}
              className={errors.title ? invalidFieldClassName : undefined}
            />
            {errors.title && <ErrorText error={errors.title?.message} />}
          </div>

          <Flex gap="3" direction={{ initial: "column", sm: "row" }}>
            <div className="w-full space-y-1.5">
              <Text as="label" size="2" weight="medium" className="block">
                City
              </Text>
              <TextField.Root
                placeholder="Lisbon"
                color={errors.city ? "red" : undefined}
                {...register("city")}
                className={errors.city ? invalidFieldClassName : undefined}
              />
              {errors.city && <ErrorText error={errors.city?.message} />}
            </div>

            <div className="w-full space-y-1.5">
              <Text as="label" size="2" weight="medium" className="block">
                Country
              </Text>
              <TextField.Root
                placeholder="Portugal"
                color={errors.country ? "red" : undefined}
                {...register("country")}
                className={errors.country ? invalidFieldClassName : undefined}
              />
              {errors.country && <ErrorText error={errors.country?.message} />}
            </div>
          </Flex>

          <Flex gap="3" direction={{ initial: "column", sm: "row" }}>
            <div className="w-full space-y-1.5">
              <Text as="label" size="2" weight="medium" className="block">
                Start Date*
              </Text>
              <TextField.Root
                type="date"
                color={errors.startDate ? "red" : undefined}
                {...register("startDate")}
                className={errors.startDate ? invalidFieldClassName : undefined}
              />
              {errors.startDate && (
                <ErrorText error={errors.startDate?.message} />
              )}
            </div>

            <div className="w-full space-y-1.5">
              <Text as="label" size="2" weight="medium" className="block">
                End Date*
              </Text>
              <TextField.Root
                type="date"
                color={errors.endDate ? "red" : undefined}
                {...register("endDate")}
                className={errors.endDate ? invalidFieldClassName : undefined}
              />
              {errors.endDate && <ErrorText error={errors.endDate?.message} />}
            </div>
          </Flex>

          <Flex gap="3" direction={{ initial: "column", sm: "row" }}>
            <div className="w-full space-y-1.5">
              <Text as="label" size="2" weight="medium" className="block">
                Approximate Cost*
              </Text>
              <TextField.Root
                type="number"
                min={0}
                step={1}
                color={errors.approximateCost ? "red" : undefined}
                {...register("approximateCost", { valueAsNumber: true })}
                className={
                  errors.approximateCost ? invalidFieldClassName : undefined
                }
              />
              {errors.approximateCost && (
                <ErrorText error={errors.approximateCost?.message} />
              )}
            </div>

            <div className="w-full space-y-1.5">
              <Text as="label" size="2" weight="medium" className="block">
                Currency
              </Text>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <Select.Root
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <Select.Trigger
                      color={errors.currency ? "red" : undefined}
                      className={
                        errors.currency ? invalidFieldClassName : undefined
                      }
                    />
                    <Select.Content>
                      {Object.entries(CURRENCY).map(([currency, symbol]) => (
                        <Select.Item key={currency} value={currency}>
                          {currency} ({symbol})
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                )}
              />
              {errors.currency && (
                <ErrorText error={errors.currency?.message} />
              )}
            </div>
          </Flex>

          <div className="space-y-1.5">
            <Text as="label" size="2" weight="medium" className="block">
              Notes
            </Text>
            <TextArea
              placeholder="Any useful details about this trip"
              rows={4}
              color={errors.notes ? "red" : undefined}
              {...register("notes")}
              className={errors.notes ? invalidFieldClassName : undefined}
            />
            {errors.notes && <ErrorText error={errors.notes?.message} />}
          </div>

          <Flex gap="3" justify="end" mt="5">
            <Dialog.Close>
              <Button type="button" variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : mode === "edit"
                  ? "Save Changes"
                  : "Create Trip"}
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
