import type { ReactNode } from "react";

type BadgeVariant = "default" | "success" | "danger" | "muted";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-muted text-foreground",
  success: "bg-success/15 text-success",
  danger: "bg-danger/15 text-danger",
  muted: "bg-muted text-muted-foreground",
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
