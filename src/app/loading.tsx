export default function LoadingState() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-standard animate-pulse text-(--brand-500)">
        Loading...
      </div>
    </div>
  );
}
