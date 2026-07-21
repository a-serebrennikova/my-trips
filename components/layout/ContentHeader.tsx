export function ContentHeader({ children }: { children: React.ReactNode }) {
  return (
    <header className="rounded-2xl border-sky-300 bg-slate-50/90 p-3 sm:p-4 ring-1 ring-slate-200/80">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {children}
      </div>
    </header>
  );
};
