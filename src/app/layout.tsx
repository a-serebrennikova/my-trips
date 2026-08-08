import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/header/Header";
import "@radix-ui/themes/styles.css";
import { appConfig } from "@/src/config/app.config";
import { Theme } from "@radix-ui/themes";
import { Manrope, Space_Grotesk } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "../auth";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

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
      <body
        className={`${manrope.variable} ${spaceGrotesk.variable} flex min-h-screen flex-col antialiased`}
      >
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
              className="flex flex-col flex-1 pb-10 pt-5 sm:pt-6"
            >
              <div className="flex flex-col flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col flex-1 space-y-5">{children}</div>
              </div>
            </main>
          </Theme>
        </SessionProvider>
      </body>
    </html>
  );
}
