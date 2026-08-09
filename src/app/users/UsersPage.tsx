import { getFriendsSummary } from "@/src/db/trips";
import { UsersList } from "@/src/components/users/UsersList";
import { getCurrentUserId } from "@/src/auth/session";
import { GuestAccessState } from "@/src/components/auth/GuestAccessState";

export async function UsersPage() {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    return <GuestAccessState />;
  }

  const friends = await getFriendsSummary(currentUserId);

  return <UsersList friends={friends} />;
}
