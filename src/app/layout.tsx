import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/header/Header";
import "@radix-ui/themes/styles.css";
import { appConfig } from "@/src/config/app.config";
import { Theme } from "@radix-ui/themes";
import { SessionProvider } from "next-auth/react";
import { auth } from "../auth";
import { NotificationCenter } from "../components/common/Notification/NotificationCenter";

export const metadata: Metadata = {
  title: appConfig.appName,
  description: appConfig.appDescription,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <SessionProvider session={session}>
          <Theme
            appearance="light"
            accentColor="teal"
            grayColor="slate"
            radius="large"
            scaling="105%"
          >
            <Header />
            <main
              style={{ height: `calc(100vh - ${appConfig.headerHeight}px)` }}
              className="flex flex-col flex-1 p-4 overflow-auto"
            >
              <div className="flex flex-col flex-1 mx-auto w-full max-w-7xl">
                <div className="flex flex-col flex-1">{children}</div>
              </div>
            </main>
            <NotificationCenter />
          </Theme>
        </SessionProvider>
      </body>
    </html>
  );
}
