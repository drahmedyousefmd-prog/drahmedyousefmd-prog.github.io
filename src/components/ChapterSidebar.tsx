"use client";

import type { Chapter } from "@/lib/types";
import { textColorFor } from "@/lib/chapters";
import { ChapterIcon } from "./icons";

export function ChapterSidebar({
  chapters,
  selectedSlug,
  onSelect,
}: {
  chapters: Chapter[];
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
}) {
  return (
    <nav className="sticky top-0 flex h-dvh w-64 shrink-0 flex-col overflow-y-auto border-r border-stone-200 bg-white p-4">
      <span className="mb-6 text-lg font-black tracking-tight text-stone-800">
        Rochetta
      </span>
      <div className="flex flex-col gap-1">
        {chapters.map((ch) => {
          const text = textColorFor(ch.colorHex);
          const isActive = selectedSlug === ch.slug;
          return (
            <button
              key={ch.slug}
              type="button"
              onClick={() => onSelect(ch.slug)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-right transition"
              style={{
                backgroundColor: isActive ? ch.colorHex : "transparent",
                color: isActive ? text : "#44403c",
              }}
            >
              <ChapterIcon name={ch.icon} className="h-[18px] w-[18px]" />
              <span className="flex-1 text-[13px] font-semibold">{ch.name}</span>
              <span
                className="text-[11px] font-bold opacity-80"
                style={isActive ? { color: text } : { color: ch.colorHex }}
              >
                {ch.count}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}