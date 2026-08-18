import { getAllTravelData } from "@/src/db/trips";
import { TripCardItem } from "../common/TripCardItem";
import { Card } from "../common/Card";

const EmptyTripsState = () => (
  <div className="rounded-2xl border border-dashed border-teal-200 bg-teal-50/50 px-4 py-10 text-center text-standard text-slate-600">
    No trips yet.
  </div>
);

export const TopTrips = async () => {
  const { users, trips } = await getAllTravelData(4, 0);

  if (trips.length === 0) {
    return <EmptyTripsState />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {trips.map((trip) => {
        const author = users.find((user) => user.id === trip.userId);
        return (
          <Card key={trip.id} className="h-full">
            <TripCardItem trip={trip} author={author} />
          </Card>
        );
      })}
    </div>
  );
};
