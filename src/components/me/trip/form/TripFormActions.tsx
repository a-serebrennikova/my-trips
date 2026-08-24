"use client";

import { Button } from "@radix-ui/themes";

type TripFormActionsProps = {
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
  submitLabel: string;
  onCancel: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

export function TripFormActions({
  isFirstStep,
  isLastStep,
  isSubmitting,
  submitLabel,
  onCancel,
  onPrevious,
  onNext,
}: TripFormActionsProps) {
  return (
    <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
      <Button type="button" variant="soft" color="gray" onClick={onCancel}>
        Cancel
      </Button>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="soft"
          color="gray"
          onClick={onPrevious}
          disabled={isFirstStep}
        >
          Back
        </Button>

        {isLastStep ? (
          <Button key="submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        ) : (
          <Button key="next" type="button" onClick={onNext}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
