import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href={"/"} className="flex items-center">
      <Image
        src="/favicon.ico"
        alt="Profile icon"
        width={40}
        height={40}
        className="text-white"
      />
      <div className="flex flex-col text-left">
        <span className="font-semibold leading-tight text-white">myTrips</span>
        <span className="font-semibold leading-tight text-white">
          Travel diary
        </span>
      </div>
    </Link>
  );
};
