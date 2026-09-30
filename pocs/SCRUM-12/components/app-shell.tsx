import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { Cook } from "@/lib/types";

export function AppShell({
  user,
  children,
}: {
  user: Cook | null;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link href="/" className="font-display text-xl font-semibold tracking-tight text-foreground">
            RecipieHub
          </Link>
          <nav className="flex flex-wrap items-center gap-2 text-sm" aria-label="Main">
            <Link href="/" className="rounded px-2 py-1 hover:bg-background">
              Feed
            </Link>
            <Link href="/search" className="rounded px-2 py-1 hover:bg-background">
              Search
            </Link>
            {user ? (
              <>
                <Link href="/recipes/new" className="rounded px-2 py-1 hover:bg-background">
                  Add recipe
                </Link>
                <Link
                  href={`/cooks/${user.id}`}
                  className="rounded px-2 py-1 hover:bg-background"
                >
                  Profile
                </Link>
                <span className="hidden text-muted sm:inline">{user.displayName}</span>
              </>
            ) : (
              <Link href="/sign-in">
                <Button variant="primary" className="text-sm">
                  Sign in
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
