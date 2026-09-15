"use client";

import Link from "next/link";
import { useRecents } from "@/lib/recents";

export function RecentsStrip() {
  const recents = useRecents();

  if (recents.length === 0) return null;

  return (
    <div className="mt-5">
      <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-stone-400">
        آخر الاطلاع
      </h3>
      <div className="flex flex-wrap gap-2">
        {recents.map((r) => (
          <Link
            key={r.id}
            href={`/case/${r.id}`}
            className="line-clamp-1 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-[12px] font-medium text-stone-600 transition hover:border-[#2E6560] hover:bg-[#2E6560] hover:text-white"
          >
            {r.title}
          </Link>
        ))}
      </div>
    </div>
  );
}