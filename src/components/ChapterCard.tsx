import Link from "next/link";
import type { Ref, CSSProperties } from "react";
import type { Chapter } from "@/lib/types";
import { ChapterIcon } from "./icons";
import { ChevronDown } from "lucide-react";
import { navigateWithTransition } from "@/lib/transition";

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
      onClick={(e) => {
        if (typeof document !== "undefined" && typeof document.startViewTransition === "function") {
          e.preventDefault();
          navigateWithTransition(`/chapter/${chapter.slug}`);
        }
      }}
    >
      <div className="cat-icon">
        <ChapterIcon name={chapter.icon} className="h-5 w-5" />
      </div>
      <span className="pt-1 text-[18px] font-bold leading-tight text-[var(--text-primary)]">
        {chapter.name}
      </span>
      <span className="text-[13px] text-[var(--text-secondary)]">
        {chapter.arabicName}
      </span>
      <div className="mt-1 flex items-center justify-between border-t border-[var(--border)] pt-3">
        <span className="text-[13px] font-bold text-[var(--text-secondary)]">
          {chapter.count} cases
        </span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--surface-raised)] text-[var(--text-muted)]">
          <ChevronDown className="h-4 w-4 -rotate-90" strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}