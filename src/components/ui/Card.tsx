import type { ReactNode } from "react";

/**
 * Generic card box. Renders an anchor when `href` is provided.
 * Note: cards keep their design via the `.card` class; page-specific cards
 * (`.category-card`, `.case-card`, `.case-row-card`) still build on it.
 */
export function Card({
  href,
  className = "",
  children,
  ariaLabel,
  onClick,
}: {
  href?: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => void;
}) {
  if (href) {
    return (
      <a href={href} className={`card ${className}`.trim()} aria-label={ariaLabel} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <div className={`card ${className}`.trim()} aria-label={ariaLabel}>
      {children}
    </div>
  );
}