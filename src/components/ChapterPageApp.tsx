"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Prescription } from "@/lib/types";
import { CaseCard } from "./CaseCard";
import { SearchBar } from "./SearchBar";
import { ChevronDown } from "lucide-react";

export function ChapterPageApp({
  name,
  arabicName,
  prescriptions,
}: {
  name: string;
  arabicName: string;
  prescriptions: Prescription[];
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return prescriptions;
    const q = query.toLowerCase();
    return prescriptions.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q)
    );
  }, [query, prescriptions]);

  return (
    <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-6 sm:px-6">
      <div className="mb-4 flex items-center gap-2 text-[13px] text-[var(--text-muted)]">
        <Link href="/" className="transition hover:text-[var(--brand)]">
          الرئيسية
        </Link>
        <ChevronDown className="h-3.5 w-3.5 -rotate-90" strokeWidth={2} />
        <span className="font-semibold text-[var(--text-secondary)]">{name}</span>
      </div>
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder={`بحث داخل ${arabicName}…`}
      />
      {results.length === 0 ? (
        <div className="mt-12 flex flex-col items-center text-[var(--text-muted)]">
          <span className="text-sm">لا توجد نتائج</span>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((rx) => (
            <CaseCard key={rx.id} rx={rx} />
          ))}
        </div>
      )}
    </main>
  );
}