"use client";

import { HeartHandshake, Stethoscope } from "lucide-react";
import { useMode, type SiteMode } from "@/lib/mode";

const OPTIONS: { value: SiteMode; label: string }[] = [
  { value: "doctor", label: "طبيب" },
  { value: "patient", label: "مريض" },
];

/**
 * Compact segmented control (زرّين: طبيب / مريض) shown under the site header.
 * No overlay, no forced decision — patient is the default on first visit.
 */
export function ModeSwitch({ className = "" }: { className?: string }) {
  const { mode, setMode } = useMode();
  const active = mode ?? "patient";

  return (
    <div
      className={`tab-group ${className}`.trim()}
      role="group"
      aria-label="وضع العرض"
    >
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={active === o.value}
          className={`tab ${active === o.value ? "active" : ""} ${o.value === "patient" && active === "patient" ? "patient" : ""}`}
          onClick={() => setMode(o.value)}
        >
          {o.value === "doctor" ? (
            <Stethoscope className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          ) : (
            <HeartHandshake className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          )}
          {o.label}
        </button>
      ))}
    </div>
  );
}