import type { Prescription } from "@/lib/types";
import { buildChapters } from "@/lib/chapters";
import { HomeApp } from "@/components/HomeApp";

// Import data directly — bundled at build time
import data from "@/data/prescriptions.json";

const prescriptions = data as unknown as Prescription[];

const counts: Record<string, number> = {};
for (const p of prescriptions) {
  counts[p.category] = (counts[p.category] ?? 0) + 1;
}

const chapters = buildChapters(counts);

export default function HomePage() {
  return (
    <HomeApp chapters={chapters} prescriptions={prescriptions} />
  );
}