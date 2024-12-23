import "./globals.css";
import type { Metadata } from "next";
import "@radix-ui/themes/styles.css";
import "./theme-config.css";
import { Inter } from "next/font/google";
import NavBar from "./NavBar";
import { Theme, ThemePanel } from "@radix-ui/themes";
import { UserProvider } from "./UserContext"; // Import the UserProvider

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ErrorXplorer",
  description: "Issue tracking made easy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <UserProvider>
          <Theme accentColor="violet" radius="large">
            <NavBar />
            <main className="p-5">{children}</main>
          </Theme>
        </UserProvider>
      </body>
    </html>
  );
}
