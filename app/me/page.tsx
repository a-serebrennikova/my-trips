import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { MePageClient } from "./MePageClient";

export default function MePage() {
  return (
    <ProtectedPage>
      <MePageClient />
    </ProtectedPage>
  );
}
