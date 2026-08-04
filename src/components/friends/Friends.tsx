import type { FriendSummary } from "@/src/db/read-models";
import Link from "next/link";
import { Card } from "../common/Card";
import { getNameLetter } from "@/src/utils/getNameLetter";
import { Avatar } from "@radix-ui/themes";

interface Props {
  friends: FriendSummary[];
}

export function Friends({ friends }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {friends.map(({ user, tripsCount }) => {
        const totalTrips = tripsCount;

        return (
          <Card key={user.id} className="h-full">
            <Link href={`/friends/${user.id}`}>
              <div className="flex items-center gap-3">
                <Avatar fallback={getNameLetter(user.name)} color="grass" />
                <div className="min-w-0">
                  <p className="text-medium font-semibold leading-none tracking-tight text-slate-900">
                    {user.name}
                  </p>
                  <p className="mt-1 text-standard text-slate-500">
                    {totalTrips} {totalTrips === 1 ? "trip" : "trips"}
                  </p>
                </div>
              </div>
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
