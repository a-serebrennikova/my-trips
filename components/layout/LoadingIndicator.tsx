type LoadingIndicatorProps = {
  message?: string;
};

export function LoadingIndicator({
  message = "Loading...",
}: LoadingIndicatorProps) {
  return (
    <div className="inline-flex items-center gap-3 text-slate-500">
      <span
        aria-hidden
        className="h-4 w-4 animate-spin rounded-full border-2 border-sky-200 border-t-sky-600"
      />
      <span className="text-sm">{message}</span>
    </div>
  );
}
