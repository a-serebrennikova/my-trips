import { LoadingIndicator } from "@/components/layout/LoadingIndicator";

export default function LoadingState() {
  return (
    <div className="glass-card flex items-center justify-center px-6 py-12 text-center">
      <LoadingIndicator message="Loading trip..." />
    </div>
  );
}
