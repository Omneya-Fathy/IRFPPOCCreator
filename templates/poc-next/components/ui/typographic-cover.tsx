type TypographicCoverProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

/** POC product/cover tile: typography on theme tokens — not faux photo files. */
export function TypographicCover({ title, subtitle, className = "" }: TypographicCoverProps) {
  const initial = title.trim().charAt(0).toUpperCase() || "?";

  return (
    <div
      className={`flex aspect-[3/4] w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-card via-background to-muted/30 p-4 text-card-foreground ${className}`}
      role="img"
      aria-label={`Cover tile for ${title}`}
    >
      <span className="text-xs font-medium uppercase tracking-wide text-muted">{initial}</span>
      <div className="space-y-1 border-t border-border/60 pt-3">
        <p className="line-clamp-3 text-sm font-semibold leading-snug">{title}</p>
        {subtitle ? <p className="line-clamp-2 text-xs text-muted">{subtitle}</p> : null}
      </div>
    </div>
  );
}
