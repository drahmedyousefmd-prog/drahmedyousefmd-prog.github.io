"use client";

import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { X } from "lucide-react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Mobile bottom-sheet dialog with a focus trap and Escape-to-close.
 * Rendered persistently (keeps the slide animation); `inert` removes the
 * closed sheet from the tab order and accessibility tree.
 */
export function Sheet({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  const trapTab = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !open || !panelRef.current) return;
    const nodes = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
    );
    if (nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (e.shiftKey) {
      if (active === first || !panelRef.current.contains(active)) {
        e.preventDefault();
        last.focus();
      }
    } else if (active === last || !panelRef.current.contains(active)) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      {open && (
        <div
          className="sheet-backdrop no-print"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        aria-hidden={!open}
        inert={!open}
        className={`sheet no-print ${open ? "" : "closed"}`.trim()}
        onKeyDown={trapTab}
      >
        <div className="sheet-handle" aria-hidden="true" />
        <button
          ref={closeRef}
          type="button"
          className="sheet-close"
          onClick={onClose}
          aria-label="إغلاق"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
        <div className="clear-both pt-2">{children}</div>
      </div>
    </>
  );
}