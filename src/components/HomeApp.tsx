"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import type { Chapter, Prescription } from "@/lib/types";
import { categoryForSlug } from "@/lib/chapters";
import { ChapterCard } from "./ChapterCard";
import { CaseRowCard } from "./CaseRowCard";
import { CreatorFooter } from "./CreatorFooter";
import { SiteNav } from "./SiteNav";
import { RecentsStrip } from "./RecentsStrip";
import { SearchIcon } from "./icons";

interface ActiveSearch {
  q: string;
  catSlug: string;
}

export function HomeApp({
  chapters,
  prescriptions,
  drugCounts,
  recent,
}: {
  chapters: Chapter[];
  prescriptions: Prescription[];
  drugCounts: Record<string, number>;
  recent: Prescription[];
}) {
  const [query, setQuery] = useState("");
  const [catSel, setCatSel] = useState("");
  const [active, setActive] = useState<ActiveSearch | null>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const results = useMemo(() => {
    if (!active) return null;
    const q = active.q.trim().toLowerCase();
    const catName = active.catSlug ? categoryForSlug(active.catSlug) : "";
    return prescriptions.filter((p) => {
      if (catName && p.category !== catName) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q)
      );
    });
  }, [active, prescriptions]);

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

  const submit = (e?: { preventDefault?: () => void }) => {
    e?.preventDefault?.();
    setActive({ q: query, catSlug: catSel });
  };

  return (
    <div className="min-h-dvh" id="top">
      <SiteNav />

      {/* Hero */}
      <section className="hero">
        <svg
          className="hero-symbols"
          viewBox="0 0 1200 340"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <path
            d="M60 200 L180 200 L220 150 L280 250 L320 180 L360 200 L470 200"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M470 200 L520 200 L560 160 L610 240 L650 180 L690 200 L800 200"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h1>دليلك السريع لأي روشتة</h1>
        <p>ابحث عن الحالة، شوف الدواء، البديل، والسعر في ثواني</p>
      </section>

      {/* Floating search card */}
      <div className="search-card no-print">
        <div className="search-field">
          <SearchIcon />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="ابحث عن حالة، دواء، تشخيص…"
            aria-label="البحث في الحالات"
          />
        </div>
        <div className="search-field">
          <select
            value={catSel}
            onChange={(e) => setCatSel(e.target.value)}
            aria-label="اختر تصنيف"
          >
            <option value="">كل التصنيفات</option>
            {chapters.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.arabicName}
              </option>
            ))}
          </select>
        </div>
        <button type="button" className="btn-search" onClick={() => submit()}>
          <SearchIcon className="h-4 w-4" />
          بحث
        </button>
      </div>

      <main className="mx-auto w-full max-w-[1100px] px-4 pb-12 pt-10 sm:px-6">
        {results ? (
          <section aria-label="نتائج البحث">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="section-heading text-start" style={{ marginBottom: 0 }}>
                نتائج البحث ({results.length})
              </h2>
              <button
                type="button"
                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-[13px] font-bold text-[var(--text-secondary)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                onClick={() => setActive(null)}
              >
                مسح البحث
              </button>
            </div>
            {results.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-[var(--text-muted)]">
                <SearchOffIcon className="mb-4 h-12 w-12 opacity-30" />
                <span className="text-sm">لا توجد نتائج — جرّب كلمة أخرى</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((rx) => (
                  <CaseRowCard key={rx.id} rx={rx} drugCount={drugCounts[rx.id]} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            <div className="mb-10">
              <RecentsStrip />
            </div>

            <section id="categories" className="mb-12 scroll-mt-24">
              <h2 className="section-heading">التصنيفات</h2>
              <p className="section-sub">اختر التخصص ثم تصفح الحالات والعلاج</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            </section>

            <section className="mb-10">
              <h2 className="section-heading">أحدث الروشتات المضافة</h2>
              <p className="section-sub">آخر الحالات المنشورة في الدليل</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {recent.map((rx) => (
                  <CaseRowCard key={rx.id} rx={rx} drugCount={drugCounts[rx.id]} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <div id="contact">
        <CreatorFooter />
      </div>
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