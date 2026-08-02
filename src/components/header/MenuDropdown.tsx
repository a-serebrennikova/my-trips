import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { BurgerIcon, HomeIcon, NAV_ICONS } from "./icons";
import { appConfig } from "@/src/config/app.config";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const MenuDropdown = () => {
  const pathname = usePathname();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-teal-500 bg-teal-600 p-2 text-teal-50 shadow-sm md:hidden"
          aria-label="Open navigation menu"
        >
          <BurgerIcon />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={10}
          className="min-w-100 rounded-3xl border border-teal-200 bg-white p-3 shadow-xl"
        >
          {appConfig.routes.map((route) => {
            const isActive =
              pathname === route.href ||
              (route.href !== "/" && pathname?.startsWith(route.href));

            return (
              <DropdownMenu.Item key={route.href} asChild>
                <Link
                  href={route.href}
                  className={`flex items-center gap-3 rounded-xl px-5 py-4 text-base font-semibold transition-colors ${
                    isActive
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {(() => {
                    const Icon = NAV_ICONS[route.href] ?? HomeIcon;
                    return <Icon />;
                  })()}
                  {route.label}
                </Link>
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
