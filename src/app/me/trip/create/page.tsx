import { getCurrentUserId } from "@/src/auth/session";
import { GuestAccessState } from "@/src/components/auth/GuestAccessState";
import { TripStepForm } from "@/src/components/me/trip/form/TripStepForm";

export default async function CreateTripPage() {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    return <GuestAccessState />;
  }

  return <TripStepForm mode="create" />;
}
