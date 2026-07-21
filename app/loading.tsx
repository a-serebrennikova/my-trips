import { PageLayout } from "@/components/layout/PageLayout";
import { LoadingIndicator } from "@/components/layout/LoadingIndicator";

export default function LoadingState() {
  return (
    <PageLayout>
      <div className="flex flex-1 items-center justify-center rounded-2xl px-4 py-6 text-center">
        <LoadingIndicator message="Loading latest trips..." />
      </div>
    </PageLayout>
  );
}
