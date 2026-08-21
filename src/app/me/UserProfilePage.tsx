import { Card } from "@/src/components/common/Card";
import { TripCardItem } from "@/src/components/common/TripCardItem";
import type { UserProfileStat } from "@/src/components/common/UserProfileHeader";
import { UserProfileHeader } from "@/src/components/common/UserProfileHeader";
import { getFriendProfileData } from "@/src/db/trips";
import { Text } from "@radix-ui/themes";
import { Divider } from "@/src/components/common/Divider";
import { notFound } from "next/navigation";
import { getStats } from "@/src/utils/getStats";
import { CreateTripDividerAction } from "@/src/components/common/CreateTripDividerAction";
import { getCurrentUserId } from "@/src/auth/session";
import { GuestAccessState } from "@/src/components/auth/GuestAccessState";

export const UserProfilePage = async () => {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    return <GuestAccessState />;
  }

  const profileData = await getFriendProfileData(currentUserId);

  if (!profileData) {
    notFound();
  }

  const { user, trips: userTrips, stats: profileStats } = profileData;

  const stats: UserProfileStat[] = getStats(profileStats);

  return (
    <>
      <Card className="flex flex-col gap-4">
        <UserProfileHeader user={user} stats={stats} currentUserId={currentUserId} />
      </Card>

      <section>
        <Divider title={"Trips"} action={<CreateTripDividerAction />} />

        {userTrips.length === 0 ? (
          <Text as="p" className="text-standard text-slate-500">
            You do not have any saved trips yet.
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
};
