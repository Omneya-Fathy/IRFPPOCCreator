import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "IRFP POC",
  description: "Local proof of concept. Fake data only.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <header className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <p className="text-sm font-semibold">IRFP POC</p>
            <p className="text-xs text-muted">Local demo. Fake data only.</p>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
