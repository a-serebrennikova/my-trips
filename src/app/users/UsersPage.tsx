import { getFriendsSummary } from "@/src/db/trips";
import { UsersList } from "@/src/components/users/UsersList";
import { getCurrentUserId } from "@/src/auth/session";

export async function UsersPage() {
  const currentUserId = await getCurrentUserId();
  const users = await getFriendsSummary(currentUserId);

  return <UsersList users={users} />;
}
