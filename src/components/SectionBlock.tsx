import type { ContentSection } from "@/lib/types";

export function SectionBlock({ section }: { section: ContentSection }) {
  const badgeColor = section.type === "WARNING"
    ? "bg-amber-100 text-amber-800"
    : section.type === "DIAGNOSIS"
      ? "bg-sky-100 text-sky-800"
      : section.type === "INVESTIGATIONS"
        ? "bg-emerald-100 text-emerald-800"
        : section.type === "TREATMENT"
          ? "bg-violet-100 text-violet-800"
          : "bg-stone-100 text-stone-700";

  if (section.type === "WARNING") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
        <span className="mb-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-800">
          ⚠ {section.displayLabel}
        </span>
        <div className="space-y-1.5 text-[13px] leading-relaxed text-stone-700">
          {section.lines.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <span className={`mb-3 inline-block rounded-full px-3 py-1 text-[11px] font-bold ${badgeColor}`}>
        {section.displayLabel}
      </span>
      <ul className="space-y-1.5 text-[13px] leading-relaxed text-stone-700">
        {section.lines.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </div>
  );
}