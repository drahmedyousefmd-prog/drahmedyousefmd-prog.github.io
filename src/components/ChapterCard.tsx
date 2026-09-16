import Link from "next/link";
import type { Ref, CSSProperties, MouseEvent } from "react";
import type { Chapter } from "@/lib/types";
import { ChapterIcon } from "./icons";
import { navigateWithTransition } from "@/lib/transition";

function handleNav(e: MouseEvent<HTMLAnchorElement>) {
  if (
    typeof document !== "undefined" &&
    typeof document.startViewTransition === "function"
  ) {
    e.preventDefault();
    navigateWithTransition(e.currentTarget.href);
  }
}

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
      href={`/chapter/${chapter.slug}`}
      className="category-card"
      style={{ "--cat": chapter.colorHex } as CSSProperties}
      onClick={handleNav}
    >
      <div className="cat-icon">
        <ChapterIcon name={chapter.icon} className="h-6 w-6" />
      </div>
      <span className="text-[18px] font-bold leading-tight text-[var(--text-primary)]">
        {chapter.name}
      </span>
      <span className="text-[13px] text-[var(--text-secondary)]">
        {chapter.arabicName}
      </span>
      <span className="mt-1 text-[13px] font-bold text-[var(--text-muted)]">
        {chapter.count} حالة
      </span>
    </Link>
  );
}