import { useSessionUserData } from "@/src/hooks/useSessionUserData";
import { getNameLetter } from "@/src/utils/getNameLetter";
import { Avatar } from "@radix-ui/themes";
import Link from "next/link";

export const ProfileLinkIcon = () => {
  const { avatarUrl, userName } = useSessionUserData();

  return (
    <Link href="/me">
      <Avatar
        src={avatarUrl}
        alt={userName}
        fallback={getNameLetter(userName)}
        size="2"
        radius="full"
        color="grass"
      />
    </Link>
  );
};
