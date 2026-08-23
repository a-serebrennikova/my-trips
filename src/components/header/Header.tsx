"use client";

import { appConfig } from "../../config/app.config";
import { Logo } from "./Logo";
import { NavigationScreenMenu } from "./NavigationScreenMenu";
import { NavLink } from "./NavLink";
import { LoginForm } from "../authForms/LoginForm";
import { RegisterForm } from "../authForms/RegisterForm";
import { useState } from "react";
import { Button } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import { ProfileLinkIcon } from "./ProfileLinkIcon";

type AuthDialogView = "login" | "register" | null;

export function Header() {
  const [activeDialog, setActiveDialog] = useState<AuthDialogView>(null);
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const openLoginDialog = () => setActiveDialog("login");
  const openRegisterDialog = () => setActiveDialog("register");
  const handleLoginDialogChange = (open: boolean) => {
    setActiveDialog(open ? "login" : null);
  };
  const handleRegisterDialogChange = (open: boolean) => {
    setActiveDialog(open ? "register" : null);
  };

  return (
    <header className="border-b border-teal-200 bg-teal-700 text-teal-50">
      <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-1 px-4 py-3 sm:px-6 lg:px-8">
        <Logo />

        <div className="flex justify-center">
          <nav className="max-lg:hidden lg:flex h-9 items-center gap-1 ">
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
            <ProfileLinkIcon />
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
