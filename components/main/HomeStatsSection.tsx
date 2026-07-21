type HomeStatsSectionProps = {
  countriesVisited: number;
  completedTrips: number;
  averageRating: string;
  friendsTraveling: number;
};

function StatBadge({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-700">
        {icon}
      </span>
      <div>
        <p className="text-3xl font-semibold leading-none text-slate-900">
          {value}
        </p>
        <p className="mt-1 text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export function HomeStatsSection({
  countriesVisited,
  completedTrips,
  averageRating,
  friendsTraveling,
}: HomeStatsSectionProps) {
  return (
    <section className="glass-card grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatBadge
        icon="◎"
        value={String(countriesVisited)}
        label="Countries visited"
      />
      <StatBadge
        icon="▣"
        value={String(completedTrips)}
        label="Trips completed"
      />
      <StatBadge icon="☆" value={averageRating} label="Average rating" />
      <StatBadge
        icon="◌"
        value={String(friendsTraveling)}
        label="Friends traveling"
      />
    </section>
  );
}
