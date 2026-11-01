import Link from "next/link";
import type { Ref, CSSProperties } from "react";
import type { Chapter } from "@/lib/types";
import { ChapterIcon } from "./icons";
import { handleTransitionNav } from "@/lib/transition";

export function ChapterCard({
  chapter,
  ref,
}: {
  chapter: Chapter;
  ref?: Ref<HTMLAnchorElement>;
}) {
  return (
    <Link
      ref={ref}
      href={`/doctor/chapter/${chapter.slug}`}
      className="category-card card"
      style={{ "--cat": chapter.colorHex } as CSSProperties}
      onClick={handleTransitionNav}
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
        {chapter.count} حالة
      </span>
    </Link>
  );
}