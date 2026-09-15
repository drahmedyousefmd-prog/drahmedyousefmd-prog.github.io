"use client";

import { useState, useMemo } from "react";
import type { Chapter, Prescription } from "@/lib/types";
import { CHAPTER_ORDER } from "@/lib/chapters";
import { ChapterCard } from "./ChapterCard";
import { CaseCard } from "./CaseCard";
import { SearchBar } from "./SearchBar";
import { RecentsStrip } from "./RecentsStrip";
import { ChapterSidebar } from "./ChapterSidebar";
import { useRecents } from "@/lib/recents";

function ChapterList({ chapters }: { chapters: Chapter[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {chapters.map((ch) => (
        <ChapterCard key={ch.slug} chapter={ch} />
      ))}
    </div>
  );
}

export function HomeApp({
  chapters,
  prescriptions,
}: {
  chapters: Chapter[];
  prescriptions: Prescription[];
}) {
  const [globalQuery, setGlobalQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const recents = useRecents();

  const globalResults = useMemo(() => {
    if (!globalQuery.trim()) return [];
    const q = globalQuery.toLowerCase();
    return prescriptions.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q)
    );
  }, [globalQuery, prescriptions]);

  const selectedChapter = selectedSlug
    ? prescriptions.filter((p) => {
        const ch = CHAPTER_ORDER.find((c) => c.slug === selectedSlug);
        return ch && p.category === ch.name;
      })
    : [];

  const selectedChapterMeta = selectedSlug
    ? chapters.find((c) => c.slug === selectedSlug)
    : null;

  const isSearching = globalQuery.trim().length > 0;

  return (
    <>
      {/* ---- Mobile / below lg ---- */}
      <div className="lg:hidden flex flex-col gap-5 px-4 pb-12 pt-6">
        <SearchBar
          value={globalQuery}
          onChange={setGlobalQuery}
          placeholder="بحث في كل الفصول…"
        />
        {isSearching ? (
          globalResults.length === 0 ? (
            <EmptyState message="لا توجد نتائج" />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {globalResults.map((rx) => (
                <CaseCard key={rx.id} rx={rx} />
              ))}
            </div>
          )
        ) : (
          <>
            {recents.length > 0 && <RecentsStrip />}
            <ChapterList chapters={chapters} />
          </>
        )}
      </div>

      {/* ---- Desktop / lg+ ---- */}
      <div className="hidden lg:flex min-h-dvh">
        <ChapterSidebar
          chapters={chapters}
          selectedSlug={selectedSlug}
          onSelect={setSelectedSlug}
        />
        <main className="flex-1 overflow-y-auto px-8 py-8">
          <SearchBar
            value={globalQuery}
            onChange={setGlobalQuery}
            placeholder="بحث في كل الفصول…"
            accent={selectedChapterMeta?.colorHex}
          />
          {isSearching ? (
            globalResults.length === 0 ? (
              <EmptyState message="لا توجد نتائج" />
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-3">
                {globalResults.map((rx) => (
                  <CaseCard key={rx.id} rx={rx} />
                ))}
              </div>
            )
          ) : selectedSlug && selectedChapterMeta ? (
            <div className="mt-6">
              <h2 className="mb-1 text-[18px] font-black text-stone-800">
                {selectedChapterMeta.name}
              </h2>
              <p className="mb-5 text-[12px] text-stone-400">
                {selectedChapterMeta.count} cases
              </p>
              {selectedChapter.length === 0 ? (
                <EmptyState message="لا توجد حالات في هذا الفصل" />
              ) : (
                <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
                  {selectedChapter.map((rx) => (
                    <CaseCard key={rx.id} rx={rx} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6">
              {recents.length > 0 && <RecentsStrip />}
              <ChapterList chapters={chapters} />
            </div>
          )}
        </main>
      </div>
    </>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-stone-400">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="mb-4 h-12 w-12 opacity-30">
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <span className="text-sm">{message}</span>
    </div>
  );
}