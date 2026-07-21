import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/Header";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

export const metadata: Metadata = {
  title: "myTrips — your trips and friends",
  description:
    "Personal travel diary: cities, impressions, notes, and friends' trips.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-sky-50 antialiased">
        <Theme>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 bg-gradient-to-b from-sky-700 to-sky-50 pb-10 pt-4">
              <div className="w-full px-4 sm:px-6 lg:px-8">{children}</div>
            </main>
          </div>
        </Theme>
      </body>
    </html>
  );
}
