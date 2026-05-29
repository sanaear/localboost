import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LocalBoost Mobile",
  description: "Mobile-first tourist experience for LocalBoost",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
