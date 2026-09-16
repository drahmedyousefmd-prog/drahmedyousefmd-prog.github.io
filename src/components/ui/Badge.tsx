import type { ReactNode } from "react";

/**
 * Small pill badge. When `color` (a #hex) is provided it renders as a quiet
 * tinted chip (`color-mix` with white 10%), matching the chapter chips.
 */
export function Badge({
  color,
  className = "",
  children,
  icon,
}: {
  color?: string;
  className?: string;
  children: ReactNode;
  icon?: ReactNode;
}) {
  const style = color
    ? { background: `color-mix(in srgb, ${color} 10%, white)`, color }
    : undefined;
  return (
    <span className={`badge ${className}`.trim()} style={style}>
      {icon}
      {children}
    </span>
  );
}