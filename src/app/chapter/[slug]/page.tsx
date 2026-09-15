import type { Prescription } from "@/lib/types";
import { CHAPTER_ORDER, getChapter, textColorFor } from "@/lib/chapters";
import { ChapterPageApp } from "@/components/ChapterPageApp";
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
  const accent = chapter.colorHex;
  const text = textColorFor(accent);

  return (
    <div className="flex min-h-dvh flex-col" style={{ backgroundColor: "#f5f1e8" }}>
      {/* Colored top bar */}
      <header
        className="flex items-center gap-3 px-5 py-4"
        style={{ backgroundColor: accent, color: text }}
      >
        <Link
          href="/"
          className="flex items-center justify-center rounded-full p-1 opacity-70 hover:opacity-100 transition"
          aria-label="الرئيسية"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        <h1 className="flex-1 text-lg font-black">{chapter.name}</h1>
        <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold">
          {chapter.arabicName}
        </span>
      </header>

      <ChapterPageApp
        name={chapter.name}
        arabicName={chapter.arabicName}
        accent={accent}
        prescriptions={prescriptions}
      />
    </div>
  );
}