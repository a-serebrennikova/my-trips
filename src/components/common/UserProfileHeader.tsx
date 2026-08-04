import type { User } from "@/src/types";
import { getNameLetter } from "@/src/utils/getNameLetter";
import { Avatar, Badge } from "@radix-ui/themes";

export type UserProfileStat = {
  label: string;
  value: string | number;
  color?: "cyan" | "teal" | "sky" | "amber" | "red" | "green";
};

type UserProfileHeaderProps = {
  user: User;
  stats: UserProfileStat[];
};

export const UserProfileHeader = ({ user, stats }: UserProfileHeaderProps) => {
  return (
    <section className="flex flex-col gap-5 rounded-3xl p-3 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start">
        <Avatar fallback={getNameLetter(user.name)} color="grass" />

        <div className="min-w-0 flex-1">
          <h1 className="text-medium font-semibold tracking-tight text-slate-900 sm:text-title">
            {user.name}
          </h1>

          <p className="mt-1 text-standard text-slate-500">{user.email}</p>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-standard text-slate-600">
            {user.homeCity ? <span>{user.homeCity}</span> : null}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 lg:justify-end">
        {stats.map(({ label, value, color }) => (
          <Badge key={`label-${color}`} color={color} size="1">
            {label}: {value}
          </Badge>
        ))}
      </div>
    </section>
  );
};
