import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
