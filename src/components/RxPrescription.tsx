import { parsePerDrugAlternatives, parseRxLines } from "@/lib/content";
import { textColorFor } from "@/lib/chapters";

export function RxPrescription({
  label,
  lines,
  perDrugAlternatives,
  chapterColor,
}: {
  label: string;
  lines: string[];
  perDrugAlternatives: string;
  chapterColor: string;
}) {
  const rxRows = parseRxLines(lines);
  const perDrug = parsePerDrugAlternatives(perDrugAlternatives);
  const text = textColorFor(chapterColor);

  return (
    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ backgroundColor: chapterColor, color: text }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
          <rect x="6" y="2" width="12" height="20" rx="2" />
          <path d="M9 10h6M12 6v8" />
        </svg>
        <span className="text-sm font-bold">{label}</span>
      </div>
      <div className="divide-y divide-stone-100 px-4">
        {rxRows.map((row) => {
          const alt = perDrug.find((p) => row.name.startsWith(p.drugName.split(" ")[0]));
          return (
            <div key={row.name + row.instruction} className="py-3">
              <p className="text-[14px] font-bold text-stone-800">{row.name}</p>
              <p className="text-[12px] text-stone-600">{row.instruction}</p>
              {row.price && (
                <span className="mt-1 inline-block rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-500">
                  {row.price}
                </span>
              )}
              {alt && alt.alternatives.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {alt.alternatives.map((a) => (
                    <span
                      key={a.name}
                      className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-[10px] font-medium text-stone-600"
                    >
                      <span>{a.name}</span>
                      {a.price && <span className="opacity-50">{a.price}</span>}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}