import { getFriendsSummary } from "@/src/db/trips";
import { Friends } from "@/src/components/friends/Friends";
import { getCurrentUserId } from "@/src/auth/session";
import { GuestAccessState } from "@/src/components/auth/GuestAccessState";

export async function FriendsPage() {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    return <GuestAccessState />;
  }

  const friends = await getFriendsSummary(currentUserId);

  return <Friends friends={friends} />;
}
