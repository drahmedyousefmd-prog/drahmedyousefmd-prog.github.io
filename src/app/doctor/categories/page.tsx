import type { Metadata } from "next";
import type { Prescription } from "@/lib/types";
import { buildChapters } from "@/lib/chapters";
import { parseContent, parseRxLines } from "@/lib/content";
import { HomeApp } from "@/components/HomeApp";
import { RequireRole } from "@/components/portal/RequireRole";

// Doctor's reference workspace: the categories / ready prescriptions grid.
// Gated — any unauthenticated direct visit is redirected to /login.
import data from "@/data/prescriptions.json";

const prescriptions = data as unknown as Prescription[];

export const metadata: Metadata = {
  robots: { index: false },
  alternates: { canonical: "/doctor/categories" },
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

export default function DoctorCategoriesPage() {
  return (
    <RequireRole role="doctor">
      <HomeApp
        chapters={chapters}
        prescriptions={prescriptions}
        drugCounts={drugCounts}
        forceDoctor
      />
    </RequireRole>
  );
}