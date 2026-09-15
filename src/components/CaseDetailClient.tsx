"use client";

import { useEffect } from "react";
import Link from "next/link";
import { addRecent } from "@/lib/recents";

export function CaseDetailClient({
  id,
  title,
  colorHex,
}: {
  id: string;
  title: string;
  colorHex: string;
}) {
  useEffect(() => {
    const timer = setTimeout(() => addRecent(id, title), 0);
    return () => clearTimeout(timer);
  }, [id, title]);

  return (
    <>
      {/* Print / Back buttons */}
      <div className="no-print fixed bottom-6 right-6 z-50 flex gap-2">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          style={{ backgroundColor: colorHex }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <path d="M6 14h12v8H6z" />
          </svg>
          تصدير PDF
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm font-bold text-stone-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          الرئيسية
        </Link>
      </div>
    </>
  );
}