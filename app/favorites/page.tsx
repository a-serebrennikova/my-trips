import { ProtectedRoute } from "@/components/ProtectedRoute";
import { FavoritesPageClient } from "./FavoritesPageClient";

export default function FavoritesPage() {
  return (
    <ProtectedRoute>
      <FavoritesPageClient />
    </ProtectedRoute>
  );
}
