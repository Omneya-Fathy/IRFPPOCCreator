import type { ReactNode } from "react";

export const metadata = {
  title: "RecipieHub",
  description: "Fictional home cooks sharing trusted recipes. Demo data only.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
