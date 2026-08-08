import { getTripById } from "@/src/db/trips";
import notFound from "../../not-found";
import { CommentsBlock } from "@/src/components/trips/CommentsBlock";
import { TripHeader } from "@/src/components/trips/TripHeader";
import { CafesBlock } from "@/src/components/trips/CafesBlock";
import { AttractionsBlock } from "@/src/components/trips/AttractionsBlock";
import { NotesBlock } from "@/src/components/trips/NotesBlock";
import { getCurrentUserId } from "@/src/auth/session";

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

  const { attractions, cafes, comments, notes } = trip;
  const currentUserId = await getCurrentUserId();
  const isGuest = !currentUserId;

  return (
    <>
      <TripHeader trip={trip} tripId={tripId} />
      <div className="grid grid-cols-1 gap-4  lg:grid-cols-2">
        {!!notes && <NotesBlock notes={notes} />}
        {!!comments.length && (
          <CommentsBlock comments={comments} isGuest={isGuest} />
        )}
        {!!cafes.length && <CafesBlock cafes={cafes} />}
        {!!attractions.length && <AttractionsBlock attractions={attractions} />}
      </div>
    </>
  );
}
