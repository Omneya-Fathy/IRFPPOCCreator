import type { Book } from "../lib/types";

type BookCoverProps = {
  book: Book;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "h-32 w-24",
  md: "h-44 w-32",
  lg: "h-64 w-44",
};

export function BookCover({ book, size = "md" }: BookCoverProps) {
  return (
    <div
      className={`flex shrink-0 items-end rounded-md border border-border p-3 text-xs font-medium text-primary-foreground shadow-sm ${sizeClasses[size]}`}
      style={{ backgroundColor: book.coverColor }}
      aria-hidden="true"
    >
      <span className="line-clamp-3">{book.title}</span>
    </div>
  );
}
