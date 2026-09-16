"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import type { Chapter, Prescription } from "@/lib/types";
import { categoryForSlug } from "@/lib/chapters";
import { ChapterCard } from "./ChapterCard";
import { CaseRowCard } from "./CaseRowCard";
import { CreatorFooter } from "./CreatorFooter";
import { SiteNav } from "./SiteNav";
import { RecentsStrip } from "./RecentsStrip";
import { SafetyBanner } from "./portal/SafetyBanner";
import { PatientServices } from "./patient/PatientServices";
import { Headset, HeartHandshake, Pill, Search, ShieldCheck, Stethoscope } from "lucide-react";
import { SearchIcon } from "./icons";
import { useMode } from "@/lib/mode";

interface ActiveSearch {
  q: string;
  catSlug: string;
}

export function HomeApp({
  chapters,
  prescriptions,
  drugCounts,
  forceDoctor = false,
}: {
  chapters: Chapter[];
  prescriptions: Prescription[];
  drugCounts: Record<string, number>;
  forceDoctor?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [catSel, setCatSel] = useState("");
  const [active, setActive] = useState<ActiveSearch | null>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const { mode } = useMode();
  const isDoctor = forceDoctor || mode === "doctor";

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
          el!.style.animationDelay = `${i * 40}ms`;
          el!.classList.add("reveal");
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
      <SafetyBanner />

      {/* Hero */}
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="hero-eyebrow">
              <ShieldCheck aria-hidden="true" />
              رعاية موثوقة، صحة أفضل
            </span>
            <h1 className="hero-title">
              <span>صحتك</span>
              <span className="hero-title-accent">أولويتنا</span>
            </h1>
            <p className="hero-lead">
              {isDoctor
                ? "دليل عملي وسريع لكل روشتاتك الطبية، بمعلومات دقيقة وموثوقة تساعدك تفهم علاجك صح."
                : "اطلب خدمتك مباشرة — استشارة، قراءة تحليل، اقرألي الروشتة، رسم قلب، نظام غذائي أو خطة علاجية."}
            </p>
            <div className="hero-actions">
              {isDoctor ? (
                <>
                  <a href="#search" className="btn-pill primary">
                    ابدأ البحث
                  </a>
                  <a href="#categories" className="btn-pill outline">
                    التصنيفات
                  </a>
                </>
              ) : (
                <a href="#services" className="btn-pill primary">
                  اطلب خدمة
                </a>
              )}
            </div>
            <ul className="hero-stats">
              <li>
                <span className="icon-circle">
                  <Pill aria-hidden="true" />
                </span>
                <strong>+500</strong>
                <span>دواء مغطى</span>
              </li>
              <li>
                <span className="icon-circle">
                  <Search aria-hidden="true" />
                </span>
                <strong>+10 آلاف</strong>
                <span>عملية بحث</span>
              </li>
              <li>
                <span className="icon-circle">
                  <Stethoscope aria-hidden="true" />
                </span>
                <strong>+25</strong>
                <span>تخصص طبي</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="hero-badge">
          <span className="badge-icon">
            <Headset aria-hidden="true" />
          </span>
          <p>
            <strong>دعم على مدار الساعة</strong>
            <span>24/7</span>
          </p>
        </div>
      </section>

      {isDoctor ? (
        <>
          {/* Floating search card */}
          <div className="search-card no-print" id="search">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              placeholder="ابحث عن حالة، دواء، تشخيص…"
              aria-label="البحث في الحالات"
              className="search-input"
            />
            <select
              value={catSel}
              onChange={(e) => setCatSel(e.target.value)}
              aria-label="اختر تصنيف"
              className="search-input"
            >
              <option value="">كل التصنيفات</option>
              {chapters.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.arabicName}
                </option>
              ))}
            </select>
            <button type="button" className="btn-pill primary" onClick={() => submit()}>
              <SearchIcon className="h-4 w-4" />
              بحث
            </button>
          </div>

          <main className="mx-auto w-full max-w-[1100px] px-4 pb-12 pt-10 sm:px-6">
            {results ? (
              <section aria-label="نتائج البحث">
                <p aria-live="polite" className="sr-only">
                  {results.length === 0
                    ? "لا توجد نتائج للبحث"
                    : `تم العثور على ${results.length} نتيجة`}
                </p>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="section-heading text-start" style={{ marginBottom: 0 }}>
                    نتائج البحث ({results.length})
                  </h2>
                  <button
                    type="button"
                    className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-[13px] font-bold text-[var(--text-secondary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
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
              </>
            )}
          </main>
        </>
      ) : (
        <main className="mx-auto w-full max-w-[1100px] px-4 pb-16 pt-10 sm:px-6">
          <PatientServices heading="خدمات المريض" />

          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-start">
            <p className="text-[13px] font-bold text-[var(--text-primary)]">
              لا تحتاج حسابًا للطلب — كل بطاقة تفتح نموذج الطلب مباشرة.
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-[var(--text-secondary)]">
              عند الإرسال يُحفظ طلبك على هذا الجهاز ويمكنك متابعته في «تذاكري». إنشاء حساب
              اختياري يساعدك في الوصول لطلباتك من أي جهاز.
            </p>
          </div>

          <div className="mb-10 mt-10 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
            <HeartHandshake className="h-5 w-5 shrink-0 text-[var(--accent)]" aria-hidden="true" />
            <p className="text-[13px] leading-relaxed text-[var(--text-secondary)]">
              من شريط «طبيب / مريض» في الأعلى يمكنك التبديل لعرض الشباتر والروشتات المرجعية
              الخاصة بالطبيب.
            </p>
          </div>
        </main>
      )}

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