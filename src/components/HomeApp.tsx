"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import type { Chapter, Prescription } from "@/lib/types";
import { ChapterCard } from "./ChapterCard";
import { CaseCard } from "./CaseCard";
import { SearchBar } from "./SearchBar";
import { RecentsStrip } from "./RecentsStrip";
import { CreatorFooter } from "./CreatorFooter";
import { useRecents } from "@/lib/recents";
import { StethoscopeIcon } from "./icons";

export function HomeApp({
  chapters,
  prescriptions,
}: {
  chapters: Chapter[];
  prescriptions: Prescription[];
}) {
  const [globalQuery, setGlobalQuery] = useState("");
  const recents = useRecents();
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

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

  const isSearching = globalQuery.trim().length > 0;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("rochetta-animated")) return;
    const els = cardRefs.current;
    requestAnimationFrame(() => {
      els.forEach((el, i) => {
        if (el) {
          el.style.animationDelay = `${i * 40}ms`;
          el.classList.add("reveal");
        }
      });
    });
    sessionStorage.setItem("rochetta-animated", "1");
  }, []);

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="mx-auto w-full max-w-[1100px] flex-1 px-4 pb-10 pt-6 sm:px-6">
        {/* Brand */}
        <div className="mb-6 flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background: "color-mix(in srgb, var(--brand) 10%, white)",
              color: "var(--brand)",
            }}
          >
            <StethoscopeIcon className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-[22px] font-extrabold leading-none text-[var(--text-primary)]">
              Rochetta
            </h1>
            <p className="mt-1 text-[13px] text-[var(--text-muted)]">
              دليل روشتات طبية — تفاصيل التشخيص والعلاج والأدوية والبدائل
            </p>
          </div>
        </div>

        <SearchBar value={globalQuery} onChange={setGlobalQuery} placeholder="ابحث عن دواء، تشخيص، أو فئة…" />

        {isSearching ? (
          globalResults.length === 0 ? (
            <EmptyState message="لا توجد نتائج — جرّب كلمة أخرى" />
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {globalResults.map((rx) => (
                <CaseCard key={rx.id} rx={rx} />
              ))}
            </div>
          )
        ) : (
          <>
            {recents.length > 0 && (
              <div className="mt-6">
                <RecentsStrip />
              </div>
            )}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {chapters.map((ch, i) => (
                <ChapterCard
                  key={ch.slug}
                  chapter={ch}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <CreatorFooter />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="mt-16 flex flex-col items-center justify-center text-[var(--text-muted)]">
      <SearchOffIcon className="mb-4 h-12 w-12 opacity-30" />
      <span className="text-sm">{message}</span>
    </div>
  );
}

function SearchOffIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
      <path d="M8 8l6 6M14 8l-6 6" />
    </svg>
  );
}