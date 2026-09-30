"use client";

import { useNotifications } from "@/lib/store-sync";

export function NotificationStrip() {
  const { items, dismiss } = useNotifications();
  if (items.length === 0) return null;

  const latest = items[items.length - 1];

  return (
    <div
      className="border-b border-border bg-card px-4 py-2 text-sm text-foreground"
      role="status"
      data-testid="email-notification-demo"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2">
        <p>
          <span className="font-medium text-accent">Email demo:</span>{" "}
          {latest.cookName} published &ldquo;{latest.recipeTitle}&rdquo;
          {items.length > 1 ? ` (+${items.length - 1} more in log)` : ""}
        </p>
        <button
          type="button"
          className="text-xs text-muted underline-offset-2 hover:underline"
          onClick={() => dismiss(latest.id)}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
