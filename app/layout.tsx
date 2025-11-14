import { Metadata } from "next";
import { WhopApp } from "@whop/react/components";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEXA",
  description: "One idea. One click. One product.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <WhopApp>{children}</WhopApp>
      </body>
    </html>
  );
}