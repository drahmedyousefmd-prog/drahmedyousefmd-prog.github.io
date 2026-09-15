import Link from "next/link";
import type { Chapter } from "@/lib/types";
import { textColorFor } from "@/lib/chapters";
import { ChapterIcon } from "./icons";

export function ChapterCard({ chapter }: { chapter: Chapter }) {
  const text = textColorFor(chapter.colorHex);
  const divider = `${text}55`; // ~33% alpha
  return (
    <Link
      href={`/chapter/${chapter.slug}`}
      className="flex flex-col rounded-[18px] p-4 min-h-[112px] shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
      style={{ backgroundColor: chapter.colorHex }}
    >
      <ChapterIcon name={chapter.icon} className="h-[22px] w-[22px] text-white/85" />
      <span className="mt-2.5 text-[15px] font-bold leading-snug" style={{ color: text }}>
        {chapter.name}
      </span>
      <span className="mt-0.5 text-[11px] opacity-80" style={{ color: text }}>
        {chapter.arabicName}
      </span>
      <div className="mt-2.5 h-px w-full" style={{ backgroundColor: divider, opacity: 0.6 }} />
      <span className="text-xs font-bold" style={{ color: text }}>
        {chapter.count} cases
      </span>
    </Link>
  );
}