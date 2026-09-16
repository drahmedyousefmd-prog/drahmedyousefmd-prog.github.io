import type { Prescription } from "@/lib/types";
import { getChapterByCategory } from "@/lib/chapters";
import {
  parseContent,
  parseRxLines,
  parsePerDrugAlternatives,
  parseSeverityBlocks,
  parseBulletLines,
} from "@/lib/content";
import { CaseDetailClient, type ClinicalTab } from "@/components/CaseDetailClient";

import data from "@/data/prescriptions.json";

const prescriptions = data as unknown as Prescription[];

export function generateStaticParams() {
  return prescriptions.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/case/[id]">) {
  const { id } = await params;
  const rx = prescriptions.find((p) => p.id === id);
  return {
    title: rx ? `${rx.title} — Rochetta` : "Rochetta",
  };
}

export default async function CasePage({ params }: PageProps<"/case/[id]">) {
  const { id } = await params;
  const rx = prescriptions.find((p) => p.id === id);

  if (!rx) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-[var(--text-muted)]">
        لم يتم العثور على الحالة
      </div>
    );
  }

  const chapter = getChapterByCategory(rx.category);
  const sections = parseContent(rx.content);

  const clinical: ClinicalTab[] = [];
  let warning: string[] | null = null;

  for (const s of sections) {
    if (s.type === "DIAGNOSIS" || s.type === "INVESTIGATIONS" || s.type === "TREATMENT") {
      clinical.push({ type: s.type, label: s.displayLabel, lines: s.lines });
    } else if (s.type === "WARNING") {
      warning = s.lines;
    }
  }

  const rxGroups = sections
    .filter((s) => s.type === "RX")
    .map((s) => ({
      label: s.displayLabel,
      rows: parseRxLines(s.lines),
    }))
    .filter((g) => g.rows.length > 0);

  const perDrug = parsePerDrugAlternatives(rx.perDrugAlternatives);
  const interactions = parseSeverityBlocks(rx.drugInteractions);
  const instructions = parseBulletLines(rx.drugInstructions ?? "");

  return (
    <CaseDetailClient
      id={rx.id}
      title={rx.title}
      subtitle={rx.subtitle || null}
      chapter={{
        slug: chapter.slug,
        name: chapter.name,
        arabicName: chapter.arabicName,
        colorHex: chapter.colorHex,
        icon: chapter.icon,
      }}
      clinical={clinical}
      warning={warning}
      rxGroups={rxGroups}
      perDrug={perDrug}
      interactions={interactions}
      instructions={instructions}
    />
  );
}