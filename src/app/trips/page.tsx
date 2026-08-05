import { TripCardItem } from "@/src/components/common/TripCardItem";
import { Card } from "@/src/components/common/Card";
import { getAllTravelData } from "@/src/db/trips";

export default async function TripsPage() {
  const { users, trips } = await getAllTravelData();

  return (
    <>
      {trips.length === 0 ? (
        <Card className="px-6 py-12 text-center ">
          <p className="text-standard text-slate-500">
            You do not have any saved trips yet. Start with your first story
            after signing in.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {trips.map((trip) => {
            const author = users.find((u) => u.id === trip.userId) ?? users[0];

            return (
              <Card key={trip.id} className="h-full">
                <TripCardItem trip={trip} author={author} />
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
