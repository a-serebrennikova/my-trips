import { Card } from "@/src/components/common/Card";
import { TripCardItem } from "@/src/components/common/TripCardItem";
import type { UserProfileStat } from "@/src/components/common/UserProfileHeader";
import { UserProfileHeader } from "@/src/components/common/UserProfileHeader";
import { getFriendProfileData } from "@/src/db/trips";
import Link from "next/link";
import { Text } from "@radix-ui/themes";
import notFound from "../../not-found";
import { Divider } from "@/src/components/Divider";
import { getStats } from "@/src/utils/getStats";

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

  const stats: UserProfileStat[] = getStats(profileStats);

  return (
    <>
      <Card className="flex flex-col gap-4">
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
        <Divider title={"Trips"} />

        {userTrips.length === 0 ? (
          <Text as="p" className="text-standard text-slate-500">
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
