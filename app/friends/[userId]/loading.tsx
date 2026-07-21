import { LoadingIndicator } from "@/components/layout/LoadingIndicator";

export default function LoadingState() {
  return (
    <div className="glass-card flex items-center justify-center px-6 py-10 text-center">
      <LoadingIndicator message="Loading friend profile..." />
    </div>
  );
}
