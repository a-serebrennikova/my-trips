import { Card } from "@/src/components/common/Card";
import { TripCardItem } from "@/src/components/common/TripCardItem";
import type { UserProfileStat } from "@/src/components/common/UserProfileHeader";
import { UserProfileHeader } from "@/src/components/common/UserProfileHeader";
import { getFriendProfileData } from "@/src/db/trips";
import Link from "next/link";
import { Text } from "@radix-ui/themes";
import notFound from "../../not-found";

export default async function FriendProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const profileData = await getFriendProfileData(userId);

  if (!profileData) {
    return notFound();
  }

  const { user, trips: userTrips, stats: profileStats } = profileData;
  const { avgRating, countriesCount, likesReceived, tripsCount } = profileStats;

  const stats: UserProfileStat[] = [
    { label: "Trips", value: tripsCount, color: "cyan" },
    { label: "Likes", value: likesReceived, color: "teal" },
    { label: "Countries", value: countriesCount, color: "sky" },
    {
      label: "Average rating",
      value: avgRating ?? "---",
      color: "amber",
    },
  ];

  if (profileStats.avgRating) {
    stats.splice(1, 0, {
      label: "Average rating",
      value: profileStats.avgRating,
    });
  }

  return (
    <>
      <Card>
        <Link
          href="/friends"
          className="inline-flex items-center gap-2 text-standard font-medium text-sky-700 transition hover:text-sky-500"
        >
          <span aria-hidden>←</span>
          Back to friends
        </Link>
        <UserProfileHeader user={user} stats={stats} />
      </Card>

      <section>
        {userTrips.length === 0 ? (
          <Text
            as="p"
            className="card-surface px-6 py-12 text-center text-standard text-slate-500"
          >
            This friend does not have any saved trips yet.
          </Text>
        ) : (
          <div className="flex flex-wrap gap-4">
            {userTrips.map((trip) => (
              <Card key={trip.id} className="min-w-75 max-w-96 flex-1">
                <TripCardItem trip={trip} author={user} />
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
