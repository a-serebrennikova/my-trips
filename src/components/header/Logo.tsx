import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href={"/"} className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-teal-600">
        <Image
          src="/favicon.ico"
          alt="Profile icon"
          width={16}
          height={16}
          className="h-4 w-4 rounded-sm"
        />
      </div>

      <div className="flex flex-col text-left">
        <span className="display-title text-standard font-semibold leading-tight text-white">
          myTrips
        </span>
        <span className="text-small leading-tight text-teal-100/85">
          Your travel stories
        </span>
      </div>
    </Link>
  );
};
