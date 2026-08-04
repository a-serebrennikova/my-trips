import { TripCardItem } from "@/src/components/common/TripCardItem";
import { Card } from "@/src/components/common/Card";
import { getAllTravelData } from "@/src/db/trips";

export default async function TripsPage() {
  const { users, trips } = await getAllTravelData();

  return (
    <>
      <Card>
        <div className="flex flex-col gap-1">
          <h1 className="page-title">
            All Trips
          </h1>
          <p className="text-standard text-slate-600/90">
            Quick overview by city: rating, days, and estimated budget.
          </p>
          <p className="text-small text-slate-600/90">{trips.length} trips</p>
        </div>
      </Card>

      {trips.length === 0 ? (
        <div className="card-surface px-6 py-12 text-center text-standard text-slate-600">
          You do not have any saved trips yet. Start with your first story after
          signing in.
        </div>
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
