import Link from "next/link";
import type { ReactNode } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { CommentFrom } from "@/components/trip/CommentForm";
import { Like } from "@/components/trip/Like";
import { ShareButton } from "@/components/trip/ShareButton";
import { getTripById } from "@/db/trips";
import { getUsers } from "@/db/users";

export const dynamic = "force-dynamic";

function formatShortDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

function formatCommentDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });
}

function iconBasePath(className: string) {
  return `h-4 w-4 stroke-current ${className}`;
}

function LocationIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconBasePath(className)}>
      <path
        d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z"
        strokeWidth="1.9"
      />
      <circle cx="12" cy="10" r="2.8" strokeWidth="1.9" />
    </svg>
  );
}

function CalendarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconBasePath(className)}>
      <rect x="3" y="5" width="18" height="16" rx="3" strokeWidth="1.9" />
      <path d="M3 9h18M8 3v4m8-4v4" strokeWidth="1.9" />
    </svg>
  );
}

function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconBasePath(className)}>
      <circle cx="12" cy="12" r="9" strokeWidth="1.9" />
      <path d="M12 7v5l3 2" strokeWidth="1.9" />
    </svg>
  );
}

function DiamondIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconBasePath(className)}>
      <path d="m12 3 9 9-9 9-9-9 9-9Z" strokeWidth="1.9" />
    </svg>
  );
}

function StatIconWrap({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sky-700">
      {children}
    </span>
  );
}

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;

  const [trip, users] = await Promise.all([getTripById(tripId), getUsers()]);

  const comments = trip?.comments ?? [];
  const tripComments = comments
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const author = users.find((u) => u.id === trip?.userId);

  if (!trip || !author) {
    return (
      <PageLayout>
        <div className="glass-card flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
          <p className="text-sm font-semibold text-slate-800">Trip not found</p>
          <Link
            href="/trips"
            className="rounded-full bg-sky-600 px-4 py-2 text-white"
          >
            Back to list
          </Link>
        </div>
      </PageLayout>
    );
  }

  const ratingStars = "★★★★★".slice(0, trip.rating);
  const tripCurrency = trip.currency === "RUB" ? "₽" : trip.currency;
  const tripRange = `${formatShortDate(trip.startDate)} — ${formatShortDate(trip.endDate)}`;
  const commentCount = tripComments.length;

  return (
    <PageLayout>
      <div className="glass-card space-y-6 p-5 sm:p-8">
        <Link
          href="/trips"
          className="inline-flex items-center gap-2 text-sm font-medium text-sky-700 transition hover:text-sky-500"
        >
          <span aria-hidden>←</span>
          <span>Back to trips</span>
        </Link>

        <header className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
              TRIP
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                {trip.title}
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Published
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
              <p className="inline-flex items-center gap-2">
                <LocationIcon className="text-slate-400" />
                {trip.city}, {trip.country}
              </p>
              <span aria-hidden className="text-slate-300">
                •
              </span>
              <p className="inline-flex items-center gap-2">
                <CalendarIcon className="text-slate-400" />
                {tripRange}
              </p>
              <span aria-hidden className="text-slate-300">
                •
              </span>
              <p className="inline-flex items-center gap-2">
                <ClockIcon className="text-slate-400" />
                {trip.days} {trip.days === 1 ? "day" : "days"}
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col items-stretch gap-3 lg:w-auto">
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm">
              <div className="flex items-center gap-2 text-slate-700">
                <span className="text-base tracking-[0.12em] text-sky-600">
                  {ratingStars}
                </span>
                <span className="font-semibold text-slate-900">
                  {trip.rating}.0 / 5
                </span>
                {/* TODO(api): Replace synthetic reviews count with backend reviews metric.
                  Keeping it hidden for now to avoid showing a fake number. */}
                {/*
              <span className="text-xs text-slate-500">
                ({commentCount + 9} reviews)
              </span>
              */}
              </div>
              <span className="text-base font-semibold text-slate-900">
                {trip.approximateCost.toLocaleString("en-US")} {tripCurrency}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <Like trip={trip} />
              <ShareButton path={`/trips/${trip.id}`} title={trip.title} />
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-5">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sky-600">
                  <DiamondIcon className="h-3.5 w-3.5" />
                </span>
                Trip Impressions
              </p>
              <p className="mt-3 text-lg leading-relaxed text-slate-700">
                {trip.notes ??
                  "The author has not added a detailed description for this trip yet."}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
                Author
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: author.avatarColor }}
                >
                  {author.name.charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {author.name}
                  </p>
                  <p className="text-xs text-slate-500">{author.homeCity}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-2xl">
            <div className="relative col-span-2 h-56 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 sm:h-72">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-slate-500">
                <p className="text-sm font-semibold">Photo not uploaded</p>
                <p className="text-xs">Add a photo to this trip card</p>
              </div>
            </div>

            <div className="relative h-28 overflow-hidden rounded-2xl bg-slate-100 sm:h-36">
              <div className="absolute inset-0 flex items-center justify-center text-[11px] text-slate-500">
                No photo
              </div>
            </div>
            <div className="relative h-28 overflow-hidden rounded-2xl bg-slate-100 sm:h-36">
              <div className="absolute inset-0 flex items-center justify-center text-[11px] text-slate-500">
                No photo
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1fr_1fr_1.3fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
              Attractions
            </p>
            <ul className="mt-4 space-y-3">
              {trip.attractions.slice(0, 3).map((place) => (
                <li key={place.id} className="flex items-start gap-3">
                  <div className="flex h-14 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[10px] text-slate-500">
                    No photo
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {place.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {place.note ??
                        "Great spot to include in your walking route."}
                    </p>
                  </div>
                </li>
              ))}
              {trip.attractions.length === 0 && (
                <li className="text-xs text-slate-500">No places added yet.</li>
              )}
            </ul>
            <Link
              href="/trips"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sky-700 transition hover:text-sky-500"
            >
              View all attractions <span aria-hidden>›</span>
            </Link>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
              Cafes & Restaurants
            </p>
            <ul className="mt-4 space-y-3">
              {trip.cafes.slice(0, 3).map((place) => (
                <li key={place.id} className="flex items-start gap-3">
                  <div className="flex h-14 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[10px] text-slate-500">
                    No photo
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {place.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {place.note ??
                        "Cozy place with local flavor and good coffee."}
                    </p>
                  </div>
                </li>
              ))}
              {trip.cafes.length === 0 && (
                <li className="text-xs text-slate-500">No cafes added yet.</li>
              )}
            </ul>
            <Link
              href="/trips"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sky-700 transition hover:text-sky-500"
            >
              View all cafes & restaurants <span aria-hidden>›</span>
            </Link>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
              Comments
            </p>

            <CommentFrom trip={trip} />

            <div className="mt-4 space-y-3">
              {tripComments.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No comments yet - be the first.
                </p>
              ) : (
                tripComments.slice(0, 2).map((comment) => {
                  const commentAuthor =
                    users.find((u) => u.id === comment.authorId) ?? author;

                  return (
                    <div
                      key={comment.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-800"
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                            style={{
                              backgroundColor: commentAuthor.avatarColor,
                            }}
                          >
                            {commentAuthor.name.charAt(0).toUpperCase()}
                          </span>
                          <span className="font-semibold text-slate-900">
                            {commentAuthor.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {formatCommentDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700">
                        {comment.message}
                      </p>
                      {/* TODO(api): Comment likes and reply action are not implemented yet.
                        Keep this section hidden until backend support is added. */}
                      {/**
                    <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="text-rose-500">♡</span>
                      <span>
                        {Math.max(1, Math.floor(comment.message.length / 24))} like
                      </span>
                      <button
                        type="button"
                        className="font-semibold text-sky-700"
                      >
                        Reply
                      </button>
                    </div>
                    */}
                    </div>
                  );
                })
              )}
            </div>

            <Link
              href="/trips"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sky-700 transition hover:text-sky-500"
            >
              View all comments ({commentCount}) <span aria-hidden>⌄</span>
            </Link>
          </article>
        </section>

        <section className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm sm:grid-cols-2 xl:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl bg-white/80 p-3">
            <StatIconWrap>
              <CalendarIcon className="h-4 w-4" />
            </StatIconWrap>
            <div>
              <p className="text-xs text-slate-500">Best time to visit</p>
              <p className="font-semibold text-slate-900">
                {new Date(trip.startDate).toLocaleDateString("en-US", {
                  month: "long",
                })}{" "}
                -{" "}
                {new Date(trip.endDate).toLocaleDateString("en-US", {
                  month: "long",
                })}
              </p>
            </div>
          </div>

          {/* TODO(api): Weather block is static for now. Hidden until real data is available.
        <div className="flex items-center gap-3 rounded-xl bg-white/80 p-3">
          <StatIconWrap>
            <span className="text-base">☀</span>
          </StatIconWrap>
          <div>
            <p className="text-xs text-slate-500">Weather</p>
            <p className="font-semibold text-slate-900">15-22°C, Sunny</p>
          </div>
        </div>
        */}

          <div className="flex items-center gap-3 rounded-xl bg-white/80 p-3">
            <StatIconWrap>
              <span className="text-base">◎</span>
            </StatIconWrap>
            <div>
              <p className="text-xs text-slate-500">Estimated budget</p>
              <p className="font-semibold text-slate-900">
                {trip.approximateCost.toLocaleString("en-US")} {tripCurrency}
              </p>
            </div>
          </div>

          {/* TODO(api): Travelers categories are static for now. Hidden until backend metadata is available.
        <div className="flex items-center gap-3 rounded-xl bg-white/80 p-3">
          <StatIconWrap>
            <span className="text-base">👥</span>
          </StatIconWrap>
          <div>
            <p className="text-xs text-slate-500">Travelers</p>
            <p className="font-semibold text-slate-900">
              Solo, Couples, Friends
            </p>
          </div>
        </div>
        */}
        </section>
      </div>
    </PageLayout>
  );
}
