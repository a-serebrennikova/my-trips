import { getTripById } from "@/src/db/trips";
import notFound from "../../not-found";
import { CommentsBlock } from "@/src/components/trips/comments/CommentsBlock";
import { TripHeader } from "@/src/components/trips/TripHeader";
import { NotesBlock } from "@/src/components/trips/NotesBlock";
import { getCurrentUserId } from "@/src/auth/session";
import { Flex, Tabs } from "@radix-ui/themes";
import { PlaceBlock } from "@/src/components/common/PlaceBlock";
import { Card } from "@/src/components/common/Card";
import { NoPhoto } from "@/src/components/common/NoPhoto";
import Carousel from "@/src/components/common/Carousel/Carousel";

const tabs = [
  {
    id: "overview",
    title: "Overview",
  },
  {
    id: "cafes",
    title: "Cafes",
  },
  {
    id: "attractions",
    title: "Attractions",
  },
];

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

  const { attractions, cafes, comments, photos, notes } = trip;
  const currentUserId = await getCurrentUserId();

  return (
    <>
      <TripHeader trip={trip} tripId={tripId} />
      <Tabs.Root defaultValue="overview" className="flex flex-col flex-1">
        <Tabs.List aria-label="Trip content tabs" className="mx-6">
          {tabs.map((tab) => (
            <Tabs.Trigger key={tab.id} value={tab.id}>
              {tab.title}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <Tabs.Content value="overview" className="flex flex-col flex-1">
          <Card className="flex-1 gap-8">
            {notes && <NotesBlock notes={notes} />}
            <div className="flex max-sm:flex-col flex-1 gap-6">
              <div className="basis-1/2 max-sm:w-full">
                {photos?.length ? (
                  <Carousel slides={photos.map((photo) => photo.url)} />
                ) : (
                  <div className="flex flex-col flex-1 w-full min-h-60">
                    <NoPhoto />
                  </div>
                )}
              </div>
              <Flex
                direction="column"
                gap="4"
                className="basis-1/2 max-sm:w-full"
              >
                <CommentsBlock
                  comments={comments}
                  tripId={tripId}
                  currentUserId={currentUserId}
                />
              </Flex>
            </div>
          </Card>
        </Tabs.Content>
        <Tabs.Content value="cafes" className="flex flex-col flex-1">
          <PlaceBlock places={cafes} noDataText="No cafes added yet." />
        </Tabs.Content>
        <Tabs.Content value="attractions" className="flex flex-col flex-1">
          <PlaceBlock
            places={attractions}
            noDataText="No attractions added yet."
          />
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}
