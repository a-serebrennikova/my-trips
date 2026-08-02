import Link from "next/link";
import { Badge } from "@radix-ui/themes";
import { getTripById } from "@/src/db/trips";
import { formatDate } from "@/src/utils/dateFormat";
import {
  LocationIcon,
  CalendarIcon,
  ClockIcon,
} from "@/src/components/main/icons";
import { Card } from "@/src/components/common/Card";
import notFound from "../../not-found";

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;

  const trip = await getTripById(tripId);

  if (!trip) {
    return (
      notFound()
    );
  }

  const tripDateRange = `${formatDate(trip.startDate)} — ${formatDate(trip.endDate)}`;

  return (
    <Card>
      <Link
        href="/trips"
        className="inline-flex items-center gap-2 text-standard font-medium text-sky-700 transition hover:text-sky-500"
      >
        <span aria-hidden>←</span>
        <span>Back to trips</span>
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start"></div>
      <div className="mt-4 flex flex-col gap-3 lg:mt-0">
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="page-title">
            {trip.title}
          </h1>
          <Badge size="2" color="green">
            Published
          </Badge>
        </div>
        <div className="flex flex-wrap gap-3">
          <Badge size="3" color="indigo">
            <p className="inline-flex items-center gap-2">
              <LocationIcon className="text-slate-400" />
              {trip.city}, {trip.country}
            </p>
          </Badge>

          <Badge size="3" color="blue">
            <ClockIcon className="text-slate-400" />
            {trip.days} {trip.days === 1 ? "day" : "days"}
          </Badge>

          <Badge size="3" color="orange">
            <CalendarIcon className="text-slate-400" />
            {tripDateRange}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
