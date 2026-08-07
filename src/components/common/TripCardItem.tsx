import { Trip, User, Currency } from "@/src/types";
import { formatDate } from "@/src/utils/dateFormat";
import { getNameLetter } from "@/src/utils/getNameLetter";
import { formatAmount } from "@/src/utils/formatAmount";
import { Avatar, Badge } from "@radix-ui/themes";
import Link from "next/link";
import { tagsColor } from "@/src/consts/tags";

interface TripCardItemProps {
  trip: Trip;
  author: User | undefined;
}

const TripTags = ({
  city,
  country,
  days,
  cost,
  currency,
}: {
  city: string;
  country: string;
  days: number;
  cost: number;
  currency: Currency;
}) => (
  <div className="flex flex-wrap gap-1.5 text-small">
    <Badge size="1" color={tagsColor.city}>
      {city},&nbsp;{country}
    </Badge>
    <Badge size="1" color={tagsColor.days}>
      {days}&nbsp;days
    </Badge>
    <Badge size="1" color={tagsColor.cost}>
      {formatAmount(cost, currency)}
    </Badge>
  </div>
);

const AuthorInfo = ({ author }: { author: User }) => (
  <div className="flex items-center  gap-2">
    <Avatar fallback={getNameLetter(author.name)} color="grass" />
    <div>
      <p className="text-standard font-semibold text-slate-900">
        {author.name}
      </p>
      <p className="text-small text-slate-500">from {author.homeCity}</p>
    </div>
  </div>
);

export const TripCardItem = ({ trip, author }: TripCardItemProps) => (
  <article className="w-full flex flex-col flex-1 rounded-2xl border border-teal-100/80 bg-white p-4 sm:p-5">
    <Link
      href={`/trips/${trip.id}`}
      className="flex flex-1 flex-col justify-between"
    >
      <TripTags
        city={trip.city}
        country={trip.country}
        days={trip.days}
        cost={trip.approximateCost}
        currency={trip.currency}
      />
      <div className="flex flex-col gap-2">
        <h3 className="display-title mt-2 page-title text-slate-900">
          {trip.title}
        </h3>

        <p className="mt-1 text-standard text-slate-500">
          {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
        </p>

        {author && <AuthorInfo author={author} />}
      </div>
    </Link>
  </article>
);
