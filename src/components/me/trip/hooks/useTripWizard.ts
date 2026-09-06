"use client";

import { useState } from "react";

export type UseTripWizardOptions = {
  initialStep?: number;
  validateCurrentStep: () => Promise<boolean>;
};

export function useTripWizard({
  initialStep = 0,
  validateCurrentStep,
}: UseTripWizardOptions) {
  const [activeStep, setActiveStep] = useState(initialStep);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [pendingStep, setPendingStep] = useState<number | null>(null);
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  const goToPreviousStep = () => {
    setActiveStep((previous) => Math.max(previous - 1, 0));
  };

  const goToNextStep = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) {
      return;
    }

    setActiveStep((previous) => Math.min(previous + 1, 4));
  };

  const requestStepChange = async (nextStep: number) => {
    if (nextStep === activeStep) {
      return;
    }

    if (nextStep > activeStep) {
      const isValid = await validateCurrentStep();
      if (!isValid) {
        return;
      }
    }

    setActiveStep(nextStep);
  };

  const handleLeaveWithoutSaving = (onLeave?: () => void) => {
    if (pendingStep !== null) {
      setActiveStep(pendingStep);
      setPendingStep(null);
      setPendingRoute(null);
      setShowLeaveDialog(false);
      return;
    }

    if (pendingRoute) {
      onLeave?.();
      setPendingRoute(null);
      setShowLeaveDialog(false);
      return;
    }

    setShowLeaveDialog(false);
  };

  const openLeaveDialog = (nextRoute?: string, nextStep?: number) => {
    setPendingRoute(nextRoute ?? null);
    setPendingStep(nextStep ?? null);
    setShowLeaveDialog(true);
  };

  const closeLeaveDialog = () => {
    setShowLeaveDialog(false);
    setPendingStep(null);
    setPendingRoute(null);
  };

  return {
    activeStep,
    showLeaveDialog,
    setActiveStep,
    goToNextStep,
    goToPreviousStep,
    requestStepChange,
    handleLeaveWithoutSaving,
    openLeaveDialog,
    closeLeaveDialog,
  };
}
