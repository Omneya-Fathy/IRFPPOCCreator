import type { HTMLAttributes, ReactNode } from "react";

export function Badge({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded border border-border bg-background px-2 py-0.5 text-xs font-medium text-muted ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
