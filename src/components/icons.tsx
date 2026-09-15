import type { ReactElement } from "react";
import type { ChapterIconKey } from "@/lib/types";

const PATHS: Record<ChapterIconKey, ReactElement> = {
  brain: (
    <>
      <path d="M12 4c-1.7 0-3 1.3-3 3 0 .3 0 .6.1.9C7.9 8.7 6.7 10.1 6.7 11.8c0 .9.3 1.8.9 2.5C6.9 15 6.3 16 6.3 17.2c0 2.2 1.8 4 4 4 .9 0 1.7-.3 2.3-.8.6.5 1.4.8 2.3.8 2.2 0 4-1.8 4-4 0-1.2-.5-2.3-1.3-3-.6-.7-.9-1.6-.9-2.4 0-1.7-1.2-3.1-2.9-3.9.1-.3.1-.6.1-.9 0-1.7-1.3-3-3-3z" />
      <path d="M8 11c.7.7 1.7.7 2.4 0M13.6 11c.7.7 1.7.7 2.4 0" />
    </>
  ),
  pill: (
    <>
      <path d="M9 2h6a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3z" />
      <path d="M12 2v20" />
    </>
  ),
  syringe: (
    <>
      <path d="M9.8 3h4.4M12 1.5v3" />
      <path d="M7.5 6.5h9l-1.2 4.9a4.6 4.6 0 0 1-3.3 3.2 4.6 4.6 0 0 1-3.3-3.2z" />
      <path d="M12 14.6v3.9M12 18.5l1.9-1.1M12 18.5l-1.9-1.1" />
    </>
  ),
  jar: (
    <>
      <path d="M6.5 5.5h11l-1.6 4.3c-.4 1.2-1.5 2-2.7 2h-2.4c-1.2 0-2.3-.8-2.7-2z" />
      <path d="M5 12h14a1 1 0 0 1 1 1v2.5c0 3-2.4 5.5-5.5 5.5H9.5C6.4 21 4 18.6 4 15.5V13a1 1 0 0 1 1-1z" />
    </>
  ),
  heart: (
    <path d="M16.5 5.5c-1.7 0-3.3 1-4.5 2.6C10.8 6.5 9.2 5.5 7.5 5.5 5 5.5 3 7.5 3 10c0 1.9.8 3.4 2.1 4.6L12 21l6.9-6.4C20.2 13.4 21 11.9 21 10c0-2.5-2-4.5-4.5-4.5z" />
  ),
  droplet: (
    <path d="M12 2.7 18.9 9.9c1.3 1.4 2 3 2 4.6 0 2.3-1.9 4.1-4.2 4.1H7.3c-2.3 0-4.2-1.8-4.2-4.1 0-1.6.7-3.2 2-4.6z" />
  ),
  lungs: (
    <>
      <path d="M12 3.5v4" />
      <path d="M12 7.5c-1.4 0-2.7 1.2-3 2.8-.3 1.5.3 3.2 0 4.7-.5 2.5 1.1 4.8 3.5 4.8 1 0 1.8-.5 1.8-1.4V10l-2.3-2.5z" />
      <path d="M12 7.5c1.4 0 2.7 1.2 3 2.8.3 1.5-.3 3.2 0 4.7.5 2.5-1.1 4.8-3.5 4.8-1 0-1.8-.5-1.8-1.4V10l2.3-2.5z" />
    </>
  ),
  bowl: (
    <>
      <path d="M9 3.2c.8.8.8 1.4 0 2.2M13.6 2.7c.8.8.8 1.4 0 2.2" />
      <path d="M3.5 13C3.5 8.9 7.4 5 12.5 5s9 3.9 9 8c0 3.8-2.9 6.5-9 6.5S3.5 16.8 3.5 13z" />
      <path d="M5.5 19.5h14" />
    </>
  ),
  grid: (
    <path d="M4 3.5h6.5v6.5H4zM13.5 3.5H20v6.5h-6.5zM4 14h6.5v6.5H4zM13.5 14H20v6.5h-6.5z" />
  ),
};

export function ChapterIcon({
  name,
  className = "",
}: {
  name: ChapterIconKey;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

export function SearchGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function PrintGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <path d="M6 14h12v8H6z" />
    </svg>
  );
}

export function BackGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}