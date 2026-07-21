import { ProtectedRoute } from "@/components/ProtectedRoute";
import { FriendsPageClient } from "./FriendsPageClient";

export default function FriendsPage() {
  return (
    <ProtectedRoute>
      <FriendsPageClient />
    </ProtectedRoute>
  );
}
