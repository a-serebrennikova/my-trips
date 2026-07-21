import type { ReactNode } from "react";

type PageLayoutProps = {
  children: ReactNode;
  className?: string;
  withUnderlay?: boolean;
};

export function PageLayout({
  children,
  className = "",
  withUnderlay = true,
}: PageLayoutProps) {
  const shellClassName = withUnderlay
    ? `glass-card min-h-[calc(100dvh-8.5rem)] bg-gradient-to-br from-slate-100 via-sky-100/65 to-slate-200/75 p-4 sm:p-5 ${className}`
    : `min-h-[calc(100dvh-8.5rem)] p-4 sm:p-5 ${className}`;

  return (
    <div className="relative left-1/2 min-h-[calc(100dvh-8.5rem)] w-screen max-w-none -translate-x-1/2 px-4 sm:px-6 lg:px-8">
      <div className={shellClassName}>{children}</div>
    </div>
  );
}
