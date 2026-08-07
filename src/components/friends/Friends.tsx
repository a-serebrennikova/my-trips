import type { FriendSummary } from "@/src/db/read-models";
import Link from "next/link";
import { Card } from "../common/Card";
import { getNameLetter } from "@/src/utils/getNameLetter";
import { Avatar, Flex } from "@radix-ui/themes";
import { EmailIcon } from "../common/icons/Email";
import { LocationPinIcon } from "../common/icons/LocationPin";

interface Props {
  friends: FriendSummary[];
}

export function Friends({ friends }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {friends.map(({ user, tripsCount }) => {
        const totalTrips = tripsCount;

        const { email, homeCity, id, name } = user;

        return (
          <Card key={id} className="h-full">
            <Link href={`/friends/${id}`}>
              <Flex justify="between" >
                <Flex gap="3" >
                  <Avatar fallback={getNameLetter(name)} color="grass" />
                  <div className="min-w-0">
                    <p className="page-title font-semibold leading-none tracking-tight text-slate-900">
                      {name}
                    </p>
                    <p className="mt-1 text-standard text-slate-500">
                      {totalTrips} {totalTrips === 1 ? "trip" : "trips"}
                    </p>
                  </div>
                </Flex>
                <div>
                  <div className="flex items-center gap-3">
                    <EmailIcon className="h-4 w-4" />
                    <span className="text-standard">
                      {email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <LocationPinIcon className="h-4 w-4" />
                    <span className="text-standard">
                      {homeCity}
                    </span>
                  </div>
                </div>
              </Flex>
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
