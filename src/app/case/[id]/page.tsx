import type { Prescription } from "@/lib/types";
import Link from "next/link";
import { getChapterByCategory, textColorFor } from "@/lib/chapters";
import { parseContent, parsePerDrugAlternatives, parseAlternatives, parseSeverityBlocks, parseBulletLines } from "@/lib/content";
import { SectionBlock } from "@/components/SectionBlock";
import { RxPrescription } from "@/components/RxPrescription";
import { CaseDetailClient } from "@/components/CaseDetailClient";

import data from "@/data/prescriptions.json";

const prescriptions = data as unknown as Prescription[];

export function generateStaticParams() {
  return prescriptions.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/case/[id]">) {
  const { id } = await params;
  const rx = prescriptions.find((p) => p.id === id);
  return {
    title: rx ? `${rx.title} — Rochetta` : "Rochetta",
  };
}

export default async function CasePage({ params }: PageProps<"/case/[id]">) {
  const { id } = await params;
  const rx = prescriptions.find((p) => p.id === id);

  if (!rx) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-stone-500">
        Case not found
      </div>
    );
  }

  const chapter = getChapterByCategory(rx.category);
  const accent = chapter.colorHex;
  const text = textColorFor(accent);

  return (
    <div className="flex min-h-dvh flex-col pb-24" style={{ backgroundColor: "#f5f1e8" }}>
      <CaseDetailClient id={rx.id} title={rx.title} colorHex={accent} />

      {/* Header */}
      <header
        className="flex items-center gap-3 px-5 py-4"
        style={{ backgroundColor: accent, color: text }}
      >
        <Link
          href={`/chapter/${chapter.slug}`}
          className="flex items-center justify-center rounded-full p-1 opacity-70 hover:opacity-100 transition"
          aria-label="رجوع للفصل"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-black leading-tight">{rx.title}</h1>
          {rx.subtitle && (
            <p className="text-[12px] opacity-80">{rx.subtitle}</p>
          )}
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="px-5 pt-4 text-[12px] text-stone-400">
        <Link href="/" className="hover:underline">الرئيسية</Link>
        <span className="mx-1.5">/</span>
        <Link href={`/chapter/${chapter.slug}`} className="hover:underline">{chapter.name}</Link>
        <span className="mx-1.5">/</span>
        <span className="font-semibold text-stone-600">{rx.title}</span>
      </div>

      {/* Content sections */}
      <main className="print-area mx-auto mt-5 w-full max-w-3xl space-y-4 px-5">
        {(() => {
          const sections = parseContent(rx.content);
          return sections.map((s) =>
            s.type === "RX" ? (
              <RxPrescription
                key={s.rawLabel}
                label={s.displayLabel}
                lines={s.lines}
                perDrugAlternatives={rx.perDrugAlternatives}
                chapterColor={accent}
              />
            ) : (
              <SectionBlock key={s.rawLabel} section={s} />
            )
          );
        })()}

        {/* Alternatives */}
        {(rx.alternatives || parsePerDrugAlternatives(rx.perDrugAlternatives).length > 0) && (
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <span className="mb-3 inline-block rounded-full bg-stone-100 px-3 py-1 text-[11px] font-bold text-stone-700">
              بدائل متاحة
            </span>
            {parseAlternatives(rx.alternatives).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {parseAlternatives(rx.alternatives).map((a) => (
                  <span key={a.name + (a.price ?? "")} className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[12px] font-medium text-stone-700">
                    {a.name}
                    {a.price && <span className="text-stone-400">{a.price}</span>}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-[12px] text-stone-500">
                تُعرض بدائل كل دواء داخل صندوق الروشتة.
              </div>
            )}
          </div>
        )}

        {/* Drug interactions */}
        {rx.drugInteractions && (() => {
          const groups = parseSeverityBlocks(rx.drugInteractions);
          if (groups.length === 0) return null;
          return (
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <span className="mb-3 inline-block rounded-full bg-red-100 px-3 py-1 text-[11px] font-bold text-red-800">
                ⚠ التفاعلات الدوائية
              </span>
              {groups.map((g) => (
                <p key={g.title} className="text-[13px] leading-relaxed text-stone-700">
                  {g.severity === "danger" ? "❌ " : "⚠️ "}
                  <strong className="font-semibold">{g.title}</strong>
                  {g.text ? ` — ${g.text}` : ""}
                </p>
              ))}
            </div>
          );
        })()}

        {/* Interactions from inline ❌/⚠️ lines */}
        {rx.drugInteractions && (() => {
          const bullets = parseBulletLines(rx.drugInteractions);
          if (bullets.length === 0) return null;
          return (
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <span className="mb-3 inline-block rounded-full bg-red-100 px-3 py-1 text-[11px] font-bold text-red-800">
                تحذيرات إضافية
              </span>
              <ul className="space-y-1.5 text-[13px] leading-relaxed text-stone-700">
                {bullets.map((b) => (
                  <li key={b.text}>{b.text}</li>
                ))}
              </ul>
            </div>
          );
        })()}

        {/* Drug instructions */}
        {rx.drugInstructions && (() => {
          const bullets = parseBulletLines(rx.drugInstructions);
          if (bullets.length === 0) return null;
          return (
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <span className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800">
                تعليمات الاستخدام
              </span>
              <ul className="space-y-1.5 text-[13px] leading-relaxed text-stone-700">
                {bullets.map((b) => (
                  <li key={b.text} className="flex gap-2">
                    <span className={b.tone === "ok" ? "" : ""}>{b.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })()}
      </main>
    </div>
  );
}