import Link from "next/link";
import type { Prescription } from "@/lib/types";
import { getChapterByCategory } from "@/lib/chapters";
import { PillIcon } from "./icons";
import { handleTransitionNav } from "@/lib/transition";

export function CaseRowCard({
  rx,
  drugCount,
}: {
  rx: Prescription;
  drugCount?: number;
}) {
  const chapter = getChapterByCategory(rx.category);
  return (
    <Link
      href={`/doctor/case/${rx.id}`}
      className="case-row-card card"
      onClick={handleTransitionNav}
    >
      <span
        className="chip-badge"
        style={{
          background: `color-mix(in srgb, ${chapter.colorHex} 10%, white)`,
          color: chapter.colorHex,
        }}
      >
        {rx.chapterAr || rx.category}
      </span>
      <h3 className="font-en">{rx.title}</h3>
      {rx.subtitle && <p className="line-clamp-2">{rx.subtitle}</p>}
      {typeof drugCount === "number" && drugCount > 0 && (
        <div className="row-card-meta">
          <span className="drug-badge">
            <PillIcon className="h-3.5 w-3.5" />
            {drugCount} {drugCount === 1 ? "دواء" : "أدوية"}
          </span>
        </div>
      )}
    </Link>
  );
}