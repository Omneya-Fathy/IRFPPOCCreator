import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
  secondary:
    "border border-border bg-card text-card-foreground hover:bg-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; children: ReactNode }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded px-3 py-2 text-sm font-medium disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
