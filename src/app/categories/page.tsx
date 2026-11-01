import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { ChapterIcon } from "@/components/icons";
import { CHAPTER_ORDER } from "@/lib/chapters";
import { PATIENT_SITE_URL } from "@/lib/site";
import type { Prescription } from "@/lib/types";
import data from "@/data/prescriptions.json";

const prescriptions = data as unknown as Prescription[];

const counts: Record<string, number> = {};
for (const p of prescriptions) {
  counts[p.category] = (counts[p.category] ?? 0) + 1;
}

export const metadata: Metadata = {
  title: "التصنيفات الطبية",
  description:
    "تصنيفات روشتة الطبية: بدائل الأدوية، جرعات الأدوية، التداخلات الدوائية وأسعار الأدوية في مصر — اختر التخصص وابدأ التصفح.",
  alternates: { canonical: "/categories" },
};

export default function CategoriesPage() {
  return (
    <PageShell>
      <h1 className="section-heading">التصنيفات الطبية</h1>
      <p className="section-sub">
        اختر التخصص ثم تصفح الحالات — العلاج المقترح، بدائل الأدوية، الجرعات
        والتداخلات الدوائية.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-3 min-[340px]:grid-cols-2 md:grid-cols-3 md:gap-4">
        {CHAPTER_ORDER.map((chapter) => (
          <a
            key={chapter.slug}
            href={`/doctor/chapter/${chapter.slug}`}
            className="category-card card"
            style={{ "--cat": chapter.colorHex } as CSSProperties}
          >
            <div className="cat-icon">
              <ChapterIcon name={chapter.icon} className="h-6 w-6" />
            </div>
            <span className="text-[15px] font-bold leading-tight text-[var(--text-primary)] break-words sm:text-[18px]">
              {chapter.name}
            </span>
            <span className="line-clamp-1 break-words text-[12px] text-[var(--text-secondary)] sm:text-[13px]">
              {chapter.arabicName}
            </span>
            <span className="mt-1 text-[12px] font-bold text-[var(--text-muted)] sm:text-[13px]">
              {counts[chapter.name] ?? 0} حالة
            </span>
          </a>
        ))}
      </div>

      <p className="mt-10 text-[13px] leading-relaxed text-[var(--text-secondary)]">
        صفحة الحالة داخل كل تصنيف موجّهة للأطباء وليست بديلًا عن القرار الطبي.
        للاستشارة المباشرة مع الطبيب زر{" "}
        <a
          href={PATIENT_SITE_URL}
          className="font-bold text-[var(--accent)]"
        >
          استشارة
        </a>
        .
      </p>
    </PageShell>
  );
}
