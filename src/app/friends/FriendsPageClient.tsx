import { getFriendsSummary } from "@/src/db/trips";
import { Friends } from "@/src/components/friends/Friends";
import { Card } from "@/src/components/common/Card";
import { Text } from "@radix-ui/themes";

const DEFAULT_CURRENT_USER_ID = "u1";

export async function FriendsPageClient() {
  const friends = await getFriendsSummary(DEFAULT_CURRENT_USER_ID);
  const friendsCount = friends.length;

  return (
    <>
      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h1 className="page-title">
              Friends
            </h1>
            <Text as="p" className="mt-1 text-standard text-slate-600">
              Open a friend profile to see their trips, likes, and comments.
            </Text>
            <Text as="p" className="mt-1 text-small text-slate-500">
              {friendsCount} friends
            </Text>
          </div>
        </div>
      </Card>
      <Friends friends={friends} />
    </>
  );
}
