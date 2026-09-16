"use client";

import type { MouseEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";

/**
 * Back control: pops to the previous page in the browser history when there is
 * one, otherwise falls back to `href` (e.g. when the page was opened directly
 * from a link). Never leaves the history empty on static hosting.
 */
export function BackLink({
  href,
  className,
  label,
  children,
}: {
  href: string;
  className?: string;
  label?: string;
  children?: ReactNode;
}) {
  const router = useRouter();

  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.replace(href);
    }
  };

  return (
    <a href={href} className={className} aria-label={label} onClick={go}>
      {children}
    </a>
  );
}