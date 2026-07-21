import { TripCard } from "@/components/trip/TripCard";
import { PageLayout } from "@/components/layout/PageLayout";
import { getAllTravelData } from "@/src/db/trips";
import Link from "next/link";

export const dynamic = "force-dynamic";

function formatShortDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });
}

export default async function FriendProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const { users, trips } = await getAllTravelData();

  const user = users.find((u) => u.id === userId);
  const userTrips = trips.filter((t) => t.userId === userId);
  const likesReceived = userTrips.reduce(
    (total, trip) => total + trip.likedByUserIds.length,
    0,
  );
  const avgRating =
    userTrips.length === 0
      ? "-"
      : (
          userTrips.reduce((total, trip) => total + trip.rating, 0) /
          userTrips.length
        ).toFixed(1);
  const latestTripDate = userTrips[0]?.startDate
    ? formatShortDate(userTrips[0].startDate)
    : "-";

  if (!user) {
    return (
      <div className="glass-card flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
        <p className="text-sm font-semibold text-slate-800">User not found</p>
        <Link
          href="/friends"
          className="rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-500"
        >
          Back to friends list
        </Link>
      </div>
    );
  }

  return (
    <PageLayout className="space-y-5">
      <div className="space-y-3 rounded-2xl bg-slate-100/80 p-3 ring-1 ring-slate-200/80 sm:p-4">
        <Link
          href="/friends"
          className="inline-flex items-center gap-2 text-sm font-medium text-sky-700 transition hover:text-sky-500"
        >
          <span aria-hidden>←</span>
          Back to friends
        </Link>

        <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex items-center gap-3">
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold text-white"
              style={{ backgroundColor: user.avatarColor }}
            >
              {user.name.charAt(0).toUpperCase()}
            </span>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                {user.name}
              </h1>
              <p className="mt-1 text-sm text-slate-600">{user.homeCity}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>

          <div className="grid w-full gap-2 sm:grid-cols-2 xl:w-auto xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-300 bg-slate-50/95 px-4 py-3">
              <p className="text-2xl font-semibold leading-none text-slate-900">
                {userTrips.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {userTrips.length === 1 ? "Trip" : "Trips"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-300 bg-slate-50/95 px-4 py-3">
              <p className="text-2xl font-semibold leading-none text-slate-900">
                {avgRating}
              </p>
              <p className="mt-1 text-xs text-slate-500">Average rating</p>
            </div>
            <div className="rounded-2xl border border-slate-300 bg-slate-50/95 px-4 py-3">
              <p className="text-2xl font-semibold leading-none text-slate-900">
                {likesReceived}
              </p>
              <p className="mt-1 text-xs text-slate-500">Likes received</p>
            </div>
            <div className="rounded-2xl border border-slate-300 bg-slate-50/95 px-4 py-3">
              <p className="text-2xl font-semibold leading-none text-slate-900">
                {latestTripDate}
              </p>
              <p className="mt-1 text-xs text-slate-500">Latest trip</p>
            </div>
          </div>
        </header>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">
          Trips by {user.name}
        </h2>

        {userTrips.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sky-300 bg-slate-50/90 px-6 py-12 text-center text-sm text-slate-500">
            This friend does not have any saved trips yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {userTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                author={user}
                showImage={false}
              />
            ))}
          </div>
        )}
      </section>
    </PageLayout>
  );
}
