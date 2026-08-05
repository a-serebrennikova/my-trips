import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href={"/"} className="flex items-center gap-2">
      <Image
        src="/favicon.ico"
        alt="Profile icon"
        width={36}
        height={36}
        className="text-white"
      />
      <div className="flex flex-col text-left">
        <span className="font-semibold leading-tight text-white">myTrips</span>
        <span className="font-semibold leading-tight text-white">
          Your travel stories
        </span>
      </div>
    </Link>
  );
};
