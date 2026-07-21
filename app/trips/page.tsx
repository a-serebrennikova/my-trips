import { ContentHeader } from "@/components/layout/ContentHeader";
import { TripCard } from "../../components/trip/TripCard";
import { PageLayout } from "@/components/layout/PageLayout";
import { getAllTravelData } from "@/db/trips";

export const dynamic = "force-dynamic";

export default async function TripsPage() {
  const { users, trips } = await getAllTravelData(20, 0);

  return (
    <PageLayout className="space-y-5" withUnderlay={false}>
      <ContentHeader>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          All Trips
        </h1>
        <p className="text-sm text-slate-600">
          Quick overview by city: rating, days, and estimated budget.
        </p>
        <p className="text-xs text-slate-500">{trips.length} trips</p>
      </ContentHeader>

      {trips.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-sky-300 bg-slate-50/90 px-6 py-12 text-center text-sm text-slate-500">
          You do not have any saved trips yet. Start with your first story after
          signing in.
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {trips.map((trip) => {
            const author = users.find((u) => u.id === trip.userId) ?? users[0];

            return (
              <TripCard
                key={trip.id}
                trip={trip}
                author={author}
                detailsBelow
              />
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}
