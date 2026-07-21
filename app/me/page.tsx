import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MePageClient } from "./MePageClient";

export default function MePage() {
  return (
    <ProtectedRoute>
      <MePageClient />
    </ProtectedRoute>
  );
}
