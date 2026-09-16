export function navigateWithTransition(href: string) {
  const doc = document as Document & {
    startViewTransition?: (update: () => void) => void;
  };
  if (typeof doc.startViewTransition === "function") {
    doc.startViewTransition(() => {
      window.location.href = href;
    });
  } else {
    window.location.href = href;
  }
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}