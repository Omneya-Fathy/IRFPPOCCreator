import type { HTMLAttributes, ReactNode } from "react";

export function Card({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={`rounded border border-border bg-card p-4 text-card-foreground shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
