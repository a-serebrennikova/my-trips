import { getFriendsSummary } from "@/src/db/trips";
import { Friends } from "@/src/components/friends/Friends";
import { appConfig } from "@/src/config/app.config";

export async function FriendsPage() {
  const friends = await getFriendsSummary(appConfig.defaultUserId);

  return <Friends friends={friends} />;
}
