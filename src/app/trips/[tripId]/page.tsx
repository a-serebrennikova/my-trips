import { getTripById } from "@/src/db/trips";
import notFound from "../../not-found";
import { CommentsBlock } from "@/src/components/trips/comments/CommentsBlock";
import { TripHeader } from "@/src/components/trips/TripHeader";
import { CafesBlock } from "@/src/components/trips/CafesBlock";
import { AttractionsBlock } from "@/src/components/trips/AttractionsBlock";
import { NotesBlock } from "@/src/components/trips/NotesBlock";
import { getCurrentUserId } from "@/src/auth/session";
import { Flex } from "@radix-ui/themes";

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

  return (
    <>
      <TripHeader trip={trip} tripId={tripId} />
      <Flex direction="column" gap="4" className="w-full">
        <Flex gap="4" direction="row" className="w-full">
          {!!notes && (
            <div className="w-full flex flexbasis-1">
              <NotesBlock notes={notes} />
            </div>
          )}

          <Flex direction="column" gap="4" className="w-full">
            {!!cafes.length && (
              <div className="w-full flex flexbasis-1">
                <CafesBlock cafes={cafes} />
              </div>
            )}
            {!!attractions.length && (
              <div className="w-full flex flexbasis-1">
                <AttractionsBlock attractions={attractions} />
              </div>
            )}
          </Flex>
        </Flex>

        {(!!comments.length || !!currentUserId) && (
          <CommentsBlock
            comments={comments}
            tripId={tripId}
            currentUserId={currentUserId}
          />
        )}
      </Flex>
    </>
  );
}
