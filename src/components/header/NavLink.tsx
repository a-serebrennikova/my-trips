import { usePathname } from "next/navigation";
import Link from "next/link";
import { HomeIcon, NAV_ICONS } from "./icons";

export const NavLink = ({ href, label }: { href: string; label: string }) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname?.startsWith(href));
  const Icon = NAV_ICONS[href] ?? HomeIcon;

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-slate-900 font-semibold transition-colors ${
        isActive
          ? "bg-(--brand-50) text-slate-900"
          : "text-(--brand-300) hover:bg-(--brand-50)/80 hover:text-slate-900"
      }`}
    >
      <Icon />
      {label}
    </Link>
  );
};