import Link from "next/link";
import type { Prescription } from "@/lib/types";
import { chapterTextColor, getChapterByCategory } from "@/lib/chapters";

export function CaseCard({ rx }: { rx: Prescription }) {
  const chapter = getChapterByCategory(rx.category);
  const chipText = chapterTextColor(rx.category);
  return (
    <Link
      href={`/case/${rx.id}`}
      className="flex flex-col gap-2 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
    >
      <span
        className="inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-bold"
        style={{ backgroundColor: chapter.colorHex, color: chipText }}
      >
        {rx.chapterAr || rx.category}
      </span>
      <h3 className="text-[15px] font-bold leading-snug text-stone-900">{rx.title}</h3>
      <p className="line-clamp-2 text-[12px] leading-relaxed text-stone-500">{rx.subtitle}</p>
    </Link>
  );
}