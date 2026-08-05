import { usePathname } from "next/navigation";
import Link from "next/link";
import { HomeIcon, NAV_ICONS } from "./icons";

//TODO посмотреть и заменитт кнопки где надо
export const NavLink = ({ href, label }: { href: string; label: string }) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname?.startsWith(href));
  const Icon = NAV_ICONS[href] ?? HomeIcon;

  return (
    <Link
      href={href}
      className={`inline-flex h-full items-center gap-2 rounded-xl px-4 transition-colors ${
        isActive ? "link-primary" : "link-ordinary"
      }`}
    >
      <Icon />
      {label}
    </Link>
  );
};
