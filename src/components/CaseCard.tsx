import Link from "next/link";
import type { Prescription } from "@/lib/types";
import { getChapterByCategory } from "@/lib/chapters";

export function CaseCard({ rx }: { rx: Prescription }) {
  const chapter = getChapterByCategory(rx.category);
  return (
    <Link href={`/case/${rx.id}`} className="case-card">
      <span
        className="inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-bold"
        style={{
          background: `color-mix(in srgb, ${chapter.colorHex} 12%, white)`,
          color: chapter.colorHex,
        }}
      >
        {rx.chapterAr || rx.category}
      </span>
      <h3 className="font-en">{rx.title}</h3>
      <p className="line-clamp-2">{rx.subtitle}</p>
    </Link>
  );
}