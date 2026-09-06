"use client";

import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { Flex, Select, Text, TextArea, TextField } from "@radix-ui/themes";
import { ErrorText } from "@/src/components/common/ErrorText";
import { CURRENCY } from "@/src/types";
import { type TripStepFormValues } from "@/src/schemas/tripForm";

type TripDetailsStepProps = {
  register: UseFormRegister<TripStepFormValues>;
  control: Control<TripStepFormValues>;
  errors: FieldErrors<TripStepFormValues>;
};

const invalidFieldClassName = "ring-1 ring-red-500";

export function TripDetailsStep({
  register,
  control,
  errors,
}: TripDetailsStepProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Text as="label" size="2" weight="medium" className="block">
          Title*
        </Text>
        <TextField.Root
          placeholder="Enter trip name"
          color={errors.title ? "red" : undefined}
          {...register("title")}
          className={errors.title ? invalidFieldClassName : undefined}
        />
        {errors.title && <ErrorText error={errors.title.message} />}
      </div>

      <Flex gap="3" direction={{ initial: "column", sm: "row" }}>
        <div className="w-full space-y-1.5">
          <Text as="label" size="2" weight="medium" className="block">
            City
          </Text>
          <TextField.Root
            placeholder="Enter city"
            color={errors.city ? "red" : undefined}
            {...register("city")}
            className={errors.city ? invalidFieldClassName : undefined}
          />
          {errors.city && <ErrorText error={errors.city.message} />}
        </div>

        <div className="w-full space-y-1.5">
          <Text as="label" size="2" weight="medium" className="block">
            Country
          </Text>
          <TextField.Root
            placeholder="Enter country"
            color={errors.country ? "red" : undefined}
            {...register("country")}
            className={errors.country ? invalidFieldClassName : undefined}
          />
          {errors.country && <ErrorText error={errors.country.message} />}
        </div>
      </Flex>

      <Flex gap="3" direction={{ initial: "column", sm: "row" }}>
        <div className="w-full space-y-1.5">
          <Text
            as="label"
            htmlFor="trip-start-date"
            size="2"
            weight="medium"
            className="block"
          >
            Start Date*
          </Text>
          <TextField.Root
            id="trip-start-date"
            type="date"
            color={errors.startDate ? "red" : undefined}
            {...register("startDate")}
            className={errors.startDate ? invalidFieldClassName : undefined}
          />
          {errors.startDate && <ErrorText error={errors.startDate.message} />}
        </div>

        <div className="w-full space-y-1.5">
          <Text
            as="label"
            htmlFor="trip-end-date"
            size="2"
            weight="medium"
            className="block"
          >
            End Date*
          </Text>
          <TextField.Root
            id="trip-end-date"
            type="date"
            color={errors.endDate ? "red" : undefined}
            {...register("endDate")}
            className={errors.endDate ? invalidFieldClassName : undefined}
          />
          {errors.endDate && <ErrorText error={errors.endDate.message} />}
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
            <ErrorText error={errors.approximateCost.message} />
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
              <Select.Root value={field.value} onValueChange={field.onChange}>
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
          {errors.currency && <ErrorText error={errors.currency.message} />}
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
        {errors.notes && <ErrorText error={errors.notes.message} />}
      </div>
    </div>
  );
}
