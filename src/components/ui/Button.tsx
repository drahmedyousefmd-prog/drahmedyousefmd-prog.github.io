import type { ReactNode } from "react";

type Variant = "primary" | "ghost" | "subtle";
type Size = "sm" | "md" | "lg";

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "btn-primary",
  ghost: "btn-ghost",
  subtle: "btn-subtle",
};

const SIZE_CLASS: Record<Size, string> = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
};

export interface ButtonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  "aria-label"?: string;
  title?: string;
  target?: string;
  rel?: string;
  style?: React.CSSProperties;
}

/** Reusable button — renders an <a> when `href` is provided, else <button>. */
export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  href,
  type = "button",
  onClick,
  ...rest
}: ButtonProps) {
  const classes = `btn ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={classes} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}