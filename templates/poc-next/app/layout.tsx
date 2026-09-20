import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "IRFP POC",
  description: "Local proof of concept. Fake data only.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
