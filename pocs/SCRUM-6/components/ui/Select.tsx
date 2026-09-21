import type { ReactNode, SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  children: ReactNode;
};

export function Select({ label, id, children, className = "", ...props }: SelectProps) {
  const selectId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1">
      <label htmlFor={selectId} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <select
        id={selectId}
        className={`w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm focus-ring ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
