import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { FriendsPageClient } from "./FriendsPageClient";

export default function FriendsPage() {
  return (
    <ProtectedPage>
      <FriendsPageClient />
    </ProtectedPage>
  );
}
