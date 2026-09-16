"use client";

import Link from "next/link";
import { useRecents } from "@/lib/recents";

export function RecentsStrip() {
  const recents = useRecents();

  if (recents.length === 0) return null;

  return (
    <div>
      <h3 className="mb-3 text-[13px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
        آخر الاطلاع
      </h3>
      <div className="flex flex-wrap gap-2">
        {recents.map((r) => (
          <Link key={r.id} href={`/case/${r.id}`} className="recent-chip">
            {r.title}
          </Link>
        ))}
      </div>
    </div>
  );
}