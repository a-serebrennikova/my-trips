import { Card } from "@/src/components/common/Card";
import { TripCardItem } from "@/src/components/common/TripCardItem";
import type { UserProfileStat } from "@/src/components/common/UserProfileHeader";
import { UserProfileHeader } from "@/src/components/common/UserProfileHeader";
import { getFriendProfileData } from "@/src/db/trips";
import { Text } from "@radix-ui/themes";
import notFound from "../../not-found";
import { Divider } from "@/src/components/common/Divider";
import { getStats } from "@/src/utils/getStats";
import { getCurrentUserId } from "@/src/auth/session";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const currentUserId = await getCurrentUserId();
  const profileData = await getFriendProfileData(userId);

  if (!profileData) {
    return notFound();
  }

  const { user, trips: userTrips, stats: profileStats } = profileData;

  const stats: UserProfileStat[] = getStats(profileStats);

  return (
    <>
      <UserProfileHeader
        user={user}
        stats={stats}
        currentUserId={currentUserId}
      />

      <Divider title={"Trips"} />

      <section className="flex flex-col flex-1">
        {userTrips.length === 0 ? (
          <Card className="flex-1 items-center justify-center">
            <Text as="p" className="text-standard">
              This user does not have any saved trips yet.
            </Text>
          </Card>
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
