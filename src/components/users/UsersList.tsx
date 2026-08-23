import type { FriendSummary } from "@/src/db/read-models";
import Link from "next/link";
import { Card } from "../common/Card";
import { getNameLetter } from "@/src/utils/getNameLetter";
import { Avatar, Flex } from "@radix-ui/themes";
import { ContactInfo } from "../common/ContactInfo";

interface Props {
  users: FriendSummary[];
}

export function UsersList({ users }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {users.map(({ user, tripsCount }) => {
        const totalTrips = tripsCount;

        const { email, homeCity, id, name } = user;

        return (
          <Card key={id} className="h-full">
            <Link href={`/users/${id}`}>
              <Flex justify="between" gap="3" direction="column">
                <Flex gap="3">
                  <Avatar
                    src={user.avatarUrl ?? undefined}
                    alt={name}
                    fallback={getNameLetter(name)}
                    color="grass"
                  />
                  <div className="min-w-0">
                    <p className="page-title font-semibold leading-none tracking-tight text-slate-900">
                      {name}
                    </p>
                    <p className="mt-1 text-standard text-slate-500">
                      {totalTrips} {totalTrips === 1 ? "trip" : "trips"}
                    </p>
                  </div>
                </Flex>
                <ContactInfo email={email} homeCity={homeCity} />
              </Flex>
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
