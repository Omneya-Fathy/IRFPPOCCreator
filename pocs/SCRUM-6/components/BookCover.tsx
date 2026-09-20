type BookCoverProps = {
  title: string;
  isbn: string;
};

export function BookCover({ title, isbn }: BookCoverProps) {
  const initials = title
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="book-cover" aria-label={`Cover placeholder for ${title}`}>
      <span className="book-cover-initials">{initials}</span>
      <span className="book-cover-isbn">{isbn}</span>
    </div>
  );
}
