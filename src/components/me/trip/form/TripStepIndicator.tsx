"use client";

import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper";

export const tripStepLabels = [
  "Trip details",
  "Photos",
  "Attractions",
  "Cafes",
  "Review",
] as const;

type TripStepIndicatorProps = {
  activeStep: number;
  onStepChange: (step: number) => void;
  onValidate: (
    step: string,
    direction: "next" | "prev",
  ) => boolean | Promise<boolean>;
};

export function TripStepIndicator({
  activeStep,
  onStepChange,
  onValidate,
}: TripStepIndicatorProps) {
  const stepperProps = {
    value: String(activeStep),
    onValueChange: (value: string) => onStepChange(Number(value)),
    onValidate,
  };

  return (
    <>
      <Stepper
        {...stepperProps}
        orientation="horizontal"
        className="hidden w-full sm:flex"
      >
        <StepperList className="w-full min-w-0 overflow-x-auto pb-1">
          {tripStepLabels.map((label, index) => (
            <StepperItem
              key={label}
              value={String(index)}
              completed={index < activeStep}
              className="min-w-0 flex-1"
            >
              <StepperTrigger
                aria-label={label}
                className="min-w-0 flex-1 px-2 py-1"
              >
                <StepperIndicator />
              </StepperTrigger>
              {index < tripStepLabels.length - 1 && (
                <StepperSeparator className="bg-black data-[state=active]:bg-black data-[state=completed]:bg-black" />
              )}
            </StepperItem>
          ))}
        </StepperList>
      </Stepper>
    </>
  );
}
