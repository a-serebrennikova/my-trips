import Link from "next/link";
import { RedirectLink } from "@/components/main/RedirectLink";
import { getAllTravelData } from "@/db/trips";

export const dynamic = "force-dynamic";

type HomeTripCard = {
  id: string;
  title: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  days: number;
  approximateCost: number;
  currency: string;
  rating: number;
  likes: number;
  userId: string;
  coverImage?: string;
};

function shortDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });
}

function formatMoney(amount: number, currency: string) {
  const symbol = currency === "RUB" ? "₽" : currency;
  return `${amount.toLocaleString("en-US")} ${symbol}`;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function TrailPlane() {
  return (
    <svg
      viewBox="0 0 126 46"
      className="h-9 w-28 text-sky-400/85"
      fill="none"
      aria-hidden
    >
      <path
        d="M2 23c14-9 22 9 34 3 10-6-5-18 6-22 13-4 13 14 24 19 8 4 13-3 20 0 9 3 12 12 19 15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeDasharray="4 5"
      />
      <path d="m102 30 21-14-8 1 1-6-14 19Z" fill="currentColor" />
    </svg>
  );
}

export default async function Home() {
  const { users, trips } = await getAllTravelData(9, 0);

  const topTrips: HomeTripCard[] = trips.slice(0, 3).map((trip) => ({
    id: trip.id,
    title: trip.title,
    city: trip.city,
    country: trip.country,
    startDate: trip.startDate,
    endDate: trip.endDate,
    days: trip.days,
    approximateCost: trip.approximateCost,
    currency: trip.currency,
    rating: trip.rating,
    likes: trip.likedByUserIds.length,
    userId: trip.userId,
    coverImage: trip.coverImage,
  }));

  // TODO(api): Demo fallback cards are intentionally disabled.
  // Re-enable only if product decides to keep synthetic onboarding content.
  const cards: HomeTripCard[] = topTrips;

  const latestCards = cards.slice(0, 2);

  // const countriesVisited = new Set(trips.map((trip) => trip.country)).size;
  // const completedTrips = trips.length;
  // const averageRating =
  //   trips.length > 0
  //     ? (
  //         trips.reduce((acc, trip) => acc + trip.rating, 0) /
  //         Math.max(1, trips.length)
  //       ).toFixed(1)
  //     : "-";
  // const friendsTraveling = users.length;

  return (
    <div className="relative left-1/2 w-screen max-w-none -translate-x-1/2 space-y-4 px-4 sm:px-6 lg:px-8">
      <div className="grid w-full items-stretch gap-4 lg:grid-cols-[1.02fr_0.98fr]">
        <section className="glass-card w-full p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
            PERSONAL TRAVEL DIARY
          </p>

          <div className="mt-4 flex items-start justify-between gap-3">
            <h1 className="max-w-[18ch] text-2xl font-semibold leading-[1.15] tracking-tight text-slate-900">
              Keep all your <span className="text-sky-600">best trips</span> in
              one place.
            </h1>
            <div className="hidden pt-1 sm:block">
              <TrailPlane />
            </div>
          </div>

          <p className="mt-5 max-w-[50ch] text-[17px] leading-relaxed text-slate-600">
            Add cities, impressions, favorite cafes, and share them with
            friends. Every trip is its own story with ratings, notes, and
            comments.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <RedirectLink
              className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-500/30 transition hover:bg-sky-500"
              signedInLabel="Go to profile"
              signedOutLabel="Sign in"
            />
            <RedirectLink
              className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-200 bg-white px-5 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
              signedInHref="/trips"
              signedOutHref="/trips"
              signedInLabel="View all trips →"
              signedOutLabel="View all trips →"
            />
          </div>

          <div className="mt-7 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
            <div className="flex h-40 flex-col items-center justify-center gap-2 bg-gradient-to-r from-slate-100 to-slate-200 text-center text-slate-500 sm:h-44">
              <p className="text-sm font-semibold">Photo not uploaded</p>
              <p className="text-xs">
                Add a photo when creating or editing a trip
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-2.5 text-xs text-slate-500 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="font-semibold text-slate-900">Cities & countries</p>
              <p className="mt-0.5">Discover amazing places</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="font-semibold text-slate-900">Cafes & notes</p>
              <p className="mt-0.5">Save your favorite spots</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="font-semibold text-slate-900">Ratings & likes</p>
              <p className="mt-0.5">See what friends love</p>
            </div>
          </div>
        </section>

        <section className="glass-card w-full min-w-0 p-5 sm:p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold leading-[1.15] tracking-tight text-slate-900">
                Latest trips
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Tap a card to view details.
              </p>
            </div>
            <RedirectLink
              className="mt-2 shrink-0 text-sm font-semibold text-sky-600 hover:text-sky-500"
              signedInHref="/trips"
              signedOutHref="/trips"
              signedInLabel="View all →"
              signedOutLabel="View all →"
            />
          </div>

          <div className="grid gap-3">
            {latestCards.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-sky-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                No trips yet.
              </div>
            ) : (
              latestCards.map((trip, index) => {
                // TODO(api): Remove fallback author once API always provides user for each trip.
                const author = users.find(
                  (user) => user.id === trip.userId,
                ) ?? {
                  id: `fallback-${index}`,
                  name: ["Maria", "Anastasia", "Ivan"][index] ?? "Traveler",
                  avatarColor:
                    ["#7c3aed", "#2563eb", "#0ea5e9"][index] ?? "#1d4ed8",
                  homeCity:
                    ["Kazan", "Moscow", "Saint Petersburg"][index] ??
                    "Unknown city",
                };

                return (
                  <article
                    key={trip.id}
                    className={`w-full rounded-3xl border border-slate-200 bg-white p-4 ${
                      index === 1 ? "hidden sm:block" : "block"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1.5 text-[11px]">
                          <span className="rounded-full bg-sky-100 px-2 py-1 font-semibold text-sky-700">
                            {trip.city}, {trip.country}
                          </span>
                          <span className="rounded-full bg-sky-100 px-2 py-1 font-semibold text-sky-700">
                            {trip.days} days
                          </span>
                        </div>
                        <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-white">
                          {trip.rating}.0 / 5 ·{" "}
                          {formatMoney(trip.approximateCost, trip.currency)}
                        </span>
                      </div>

                      <h3 className="mt-2 text-2xl font-semibold leading-[1.15] tracking-tight text-slate-900">
                        {trip.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {shortDate(trip.startDate)} — {shortDate(trip.endDate)}
                      </p>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white"
                            style={{ backgroundColor: author.avatarColor }}
                          >
                            {initials(author.name).charAt(0) || "T"}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {author.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              from {author.homeCity}
                            </p>
                          </div>
                        </div>

                        <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-500">
                          ♥ {trip.likes} likes
                        </span>
                      </div>

                      <div className="mt-2 flex justify-end">
                        <Link
                          href={`/trips/${trip.id}`}
                          className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
                        >
                          View details →
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>
      {/* TODO need to work */}
      {/* 
      <HomeStatsSection
        countriesVisited={countriesVisited}
        completedTrips={completedTrips}
        averageRating={averageRating}
        friendsTraveling={friendsTraveling}
      /> */}
    </div>
  );
}
