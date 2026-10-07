import type { ReactNode } from "react";
import "./globals.css";
import { ActorProvider } from "@/components/actor-provider";
import { AppShell } from "@/components/app-shell";

export const metadata = {
  title: "RecipieHub",
  description: "Recipe sharing demo. Fictional cooks and local data only.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ActorProvider>
          <AppShell>{children}</AppShell>
        </ActorProvider>
      </body>
    </html>
  );
}
