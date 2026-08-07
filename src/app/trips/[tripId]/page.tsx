import { getTripById } from "@/src/db/trips";
import notFound from "../../not-found";
import { CommentsBlock } from "@/src/components/trips/CommentsBlock";
import { TripHeader } from "@/src/components/trips/TripHeader";
import { appConfig } from "@/src/config/app.config";
import { CafesBlock } from "@/src/components/trips/CafesBlock";
import { AttractionsBlock } from "@/src/components/trips/AttractionsBlock";
import { NotesBlock } from "@/src/components/trips/NotesBlock";

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;

  const trip = await getTripById(tripId);

  if (!trip) {
    return notFound();
  }

  const isOwnTrip = trip.userId === appConfig.defaultUserId;
  const { attractions, cafes, comments, notes } = trip;

  return (
    <>
      <TripHeader
        trip={trip}
        tripId={tripId}
        showCreateTripButton={isOwnTrip}
      />
      <div className="grid grid-cols-1 gap-4  lg:grid-cols-2">
        {!!notes && <NotesBlock notes={notes} />}
        {!!comments.length && <CommentsBlock comments={comments} />}
        {!!cafes.length && <CafesBlock cafes={cafes} />}
        {!!attractions.length && <AttractionsBlock attractions={attractions} />}
      </div>
    </>
  );
}
