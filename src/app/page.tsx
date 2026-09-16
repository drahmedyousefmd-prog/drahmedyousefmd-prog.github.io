import type { Metadata } from "next";
import type { Prescription } from "@/lib/types";
import { buildChapters } from "@/lib/chapters";
import { parseContent, parseRxLines } from "@/lib/content";
import { HomeApp } from "@/components/HomeApp";

// Public landing — hero + services + reference content, no login required.
import data from "@/data/prescriptions.json";

const prescriptions = data as unknown as Prescription[];

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const counts: Record<string, number> = {};
const drugCounts: Record<string, number> = {};
for (const p of prescriptions) {
  counts[p.category] = (counts[p.category] ?? 0) + 1;
  let drugs = 0;
  for (const s of parseContent(p.content)) {
    if (s.type === "RX") drugs += parseRxLines(s.lines).length;
  }
  drugCounts[p.id] = drugs;
}

const chapters = buildChapters(counts);

export default function HomePage() {
  return (
    <HomeApp
      chapters={chapters}
      prescriptions={prescriptions}
      drugCounts={drugCounts}
    />
  );
}