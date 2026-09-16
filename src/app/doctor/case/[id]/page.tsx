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
import { JsonLd } from "@/components/JsonLd";
import { SafetyBanner } from "@/components/portal/SafetyBanner";
import { SITE_URL, SITE, CONTACT } from "@/lib/site";

import data from "@/data/prescriptions.json";

const prescriptions = data as unknown as Prescription[];

export function generateStaticParams() {
  return prescriptions.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/doctor/case/[id]">) {
  const { id } = await params;
  const rx = prescriptions.find((p) => p.id === id);
  if (!rx) return { title: "Rochetta" };
  const url = `${SITE_URL}/doctor/case/${rx.id}`;
  const chapter = getChapterByCategory(rx.category);
  const description =
    rx.subtitle ||
    `روشتة "${rx.title}" من ${chapter.arabicName} — التعليمات، البدائل، والتفاعلات الدوائية من Rochetta، دليل روشتات مصر.`;
  return {
    title: rx.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${rx.title} — ${chapter.arabicName} | Rochetta`,
      description,
      siteName: SITE.name,
      locale: "ar_EG",
    },
  };
}

export default async function CasePage({ params }: PageProps<"/doctor/case/[id]">) {
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
    <>
      <SafetyBanner />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "MedicalWebPage",
              "@id": `${SITE_URL}/doctor/case/${rx.id}#medicalwebpage`,
              name: rx.title,
              description: rx.subtitle || undefined,
              url: `${SITE_URL}/doctor/case/${rx.id}`,
              inLanguage: "ar",
              isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE.name, url: SITE_URL },
              author: { "@type": "Person", name: CONTACT.creatorName },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Rochetta", item: SITE_URL },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: chapter.name,
                  item: `${SITE_URL}/doctor/chapter/${chapter.slug}`,
                },
                { "@type": "ListItem", position: 3, name: rx.title, item: `${SITE_URL}/doctor/case/${rx.id}` },
              ],
            },
          ],
        }}
      />
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
      patient={{
        diagnosisSummary: rx.patient_diagnosis_summary ?? "",
        interactionsSummary: rx.patient_interactions_summary ?? "",
        alarmSigns: rx.alarm_signs_patient ?? [],
      }}
    />
    </>
  );
}