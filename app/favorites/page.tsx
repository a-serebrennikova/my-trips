import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { FavoritesPageClient } from "./FavoritesPageClient";

export default function FavoritesPage() {
  return (
    <ProtectedPage>
      <FavoritesPageClient />
    </ProtectedPage>
  );
}
