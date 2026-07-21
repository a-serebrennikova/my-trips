import { PageLayout } from "@/components/layout/PageLayout";
import { LoadingIndicator } from "@/components/layout/LoadingIndicator";

export default function LoadingState() {
  return (
    <PageLayout>
      <div className="flex items-center justify-center px-6 py-12 text-center">
        <LoadingIndicator message="Loading favorites..." />
      </div>
    </PageLayout>
  );
}
