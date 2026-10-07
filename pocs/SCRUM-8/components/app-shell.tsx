"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActor } from "@/components/actor-provider";
import { NotificationStrip } from "@/components/notification-strip";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { actor } = useActor();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/90 shadow-sm">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link href="/" className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            RecipieHub
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm">
            <Link
              href="/search"
              className={`text-muted hover:text-foreground ${pathname.startsWith("/search") ? "font-semibold text-foreground" : ""}`}
            >
              Search
            </Link>
            <Link
              href="/recipes/new"
              className="rounded bg-primary px-3 py-1.5 font-medium text-primary-foreground hover:opacity-90"
            >
              Publish
            </Link>
            <Link
              href="/sign-in"
              className="text-muted hover:text-foreground"
              aria-label={`Active demo cook: ${actor.name}`}
            >
              {actor.name}
            </Link>
          </nav>
        </div>
      </header>
      <NotificationStrip />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
