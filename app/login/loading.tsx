import { LoadingIndicator } from "@/components/layout/LoadingIndicator";

export default function LoadingState() {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <LoadingIndicator message="Loading users..." />
    </div>
  );
}
