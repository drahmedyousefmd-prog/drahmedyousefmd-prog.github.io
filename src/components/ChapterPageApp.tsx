"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Prescription } from "@/lib/types";
import { CaseCard } from "./CaseCard";
import { SearchBar } from "./SearchBar";

export function ChapterPageApp({
  name,
  arabicName,
  accent,
  prescriptions,
}: {
  name: string;
  arabicName: string;
  accent: string;
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
    <main className="flex-1 px-5 py-6">
      <div className="mb-4 text-[12px] text-stone-400">
        <Link href="/" className="hover:underline">الرئيسية</Link>
        <span className="mx-1.5">/</span>
        <span className="font-semibold text-stone-600">{name}</span>
      </div>
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder={`بحث داخل ${arabicName}…`}
        accent={accent}
      />
      {results.length === 0 ? (
        <div className="mt-12 flex flex-col items-center text-stone-400">
          <span className="text-sm">لا توجد نتائج</span>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((rx) => (
            <CaseCard key={rx.id} rx={rx} />
          ))}
        </div>
      )}
    </main>
  );
}