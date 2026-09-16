import type { Prescription } from "@/lib/types";
import { CHAPTER_ORDER, getChapter } from "@/lib/chapters";
import { ChapterPageApp } from "@/components/ChapterPageApp";
import { ChapterIcon, BackIcon } from "@/components/icons";
import Link from "next/link";

import psychiatry from "@/data/chapters/psychiatry.json";
import pain from "@/data/chapters/pain-analgesics.json";
import antibiotics from "@/data/chapters/antibiotics.json";
import dermatology from "@/data/chapters/dermatology.json";
import cardiovascular from "@/data/chapters/cardiovascular.json";
import urinary from "@/data/chapters/urinary.json";
import respiratory from "@/data/chapters/respiratory.json";
import git from "@/data/chapters/git.json";
import others from "@/data/chapters/others.json";

const CHAPTER_DATA: Record<string, Prescription[]> = {
  psychiatry: psychiatry as Prescription[],
  "pain-analgesics": pain as Prescription[],
  antibiotics: antibiotics as Prescription[],
  dermatology: dermatology as Prescription[],
  cardiovascular: cardiovascular as Prescription[],
  urinary: urinary as Prescription[],
  respiratory: respiratory as Prescription[],
  git: git as Prescription[],
  others: others as Prescription[],
};

export function generateStaticParams() {
  return CHAPTER_ORDER.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/chapter/[slug]">) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  return {
    title: chapter ? `${chapter.name} — Rochetta` : "Rochetta",
  };
}

export default async function ChapterPage({ params }: PageProps<"/chapter/[slug]">) {
  const { slug } = await params;
  const chapter = getChapter(slug) ?? CHAPTER_ORDER[CHAPTER_ORDER.length - 1];
  const prescriptions = CHAPTER_DATA[slug] ?? [];

  return (
    <div
      className="flex min-h-dvh flex-col"
      style={{
        background: "color-mix(in srgb, " + chapter.colorHex + " 6%, var(--bg))",
      }}
    >
      {/* Quiet header */}
      <header className="case-header">
        <div className="mx-auto flex w-full max-w-[1100px] items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="no-print flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
            aria-label="الرئيسية"
          >
            <BackIcon className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-[22px] font-extrabold leading-tight text-[var(--text-primary)]">
              {chapter.name}
            </h1>
            <span
              className="mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] font-bold"
              style={{
                background: `color-mix(in srgb, ${chapter.colorHex} 10%, white)`,
                color: chapter.colorHex,
              }}
            >
              <ChapterIcon name={chapter.icon} className="h-3 w-3" />
              {chapter.arabicName}
            </span>
          </div>
        </div>
      </header>

      <ChapterPageApp
        name={chapter.name}
        arabicName={chapter.arabicName}
        prescriptions={prescriptions}
      />
    </div>
  );
}