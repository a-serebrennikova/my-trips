"use client";

import { usePathname } from "next/navigation";
import { ProfileDropdown } from "./ProfileDropdown";
import { ProfileScreenMenu } from "./ProfileScreenMenu";
import { appConfig } from "../../config/app.config";
import { Logo } from "./Logo";
import { NavigationScreenMenu } from "./NavigationScreenMenu";
import { NavLink } from "./NavLink";
import { LoginForm } from "../authForms/LoginForm";
import { RegisterForm } from "../authForms/RegisterForm";
import { useAuthStore } from "@/src/store/authStore";
import { useState } from "react";
import { Button } from "@radix-ui/themes";
import { signOutUser } from "@/src/auth/signOut";

type AuthDialogView = "login" | "register" | null;

export function Header() {
  const pathname = usePathname();
  const isProfileActive = pathname === "/me";
  const [activeDialog, setActiveDialog] = useState<AuthDialogView>(null);
  const { isAuthenticated, setAuthState } = useAuthStore();

  const openLoginDialog = () => setActiveDialog("login");
  const openRegisterDialog = () => setActiveDialog("register");
  const handleLoginDialogChange = (open: boolean) => {
    setActiveDialog(open ? "login" : null);
  };
  const handleRegisterDialogChange = (open: boolean) => {
    setActiveDialog(open ? "register" : null);
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setAuthState("unauthenticated", null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="border-b border-teal-200 bg-teal-700 text-teal-50">
      <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Logo />

        <div className="flex justify-center">
          <nav className="max-lg:hidden lg:flex h-9 items-center gap-1 rounded-2xl bg-teal-600 p-1.5 shadow-sm">
            {appConfig.routes.map((route) => (
              <NavLink key={route.href} href={route.href} label={route.label} />
            ))}
          </nav>
        </div>

        <div className="flex items-center justify-end gap-2">
          <div className="lg:hidden">
            <NavigationScreenMenu />
          </div>
          {isAuthenticated ? (
            <>
              <div className="lg:hidden">
                <ProfileScreenMenu
                  onSignOut={handleSignOut}
                  isProfileActive={isProfileActive}
                />
              </div>
              <div className="hidden lg:block">
                <ProfileDropdown
                  onSignOut={handleSignOut}
                  isProfileActive={isProfileActive}
                />
              </div>
            </>
          ) : (
            <Button onClick={openLoginDialog}>Sign in</Button>
          )}
        </div>
      </div>

      <LoginForm
        open={activeDialog === "login"}
        onOpenChange={handleLoginDialogChange}
        onOpenRegister={openRegisterDialog}
      />
      <RegisterForm
        open={activeDialog === "register"}
        onOpenChange={handleRegisterDialogChange}
        onOpenLogin={openLoginDialog}
      />
    </header>
  );
}
