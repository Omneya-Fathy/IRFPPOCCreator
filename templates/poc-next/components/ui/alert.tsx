import type { HTMLAttributes, ReactNode } from "react";

type Tone = "info" | "error" | "success";

const tones: Record<Tone, string> = {
  info: "border-border bg-background text-foreground",
  error: "border-border bg-background text-foreground",
  success: "border-border bg-background text-foreground",
};

export function Alert({
  tone = "info",
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { tone?: Tone; children: ReactNode }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`rounded border px-3 py-2 text-sm ${tones[tone]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
