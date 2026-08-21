import { useSession } from "next-auth/react";

export const useSessionUserData = () => {
  const { data: session } = useSession();

  const userName = session?.user?.name ?? "User";
  const avatarUrl = session?.user?.avatarUrl
    ? session.user.avatarUrl
    : undefined;

    return {
        userName,
        avatarUrl,
    }
};
