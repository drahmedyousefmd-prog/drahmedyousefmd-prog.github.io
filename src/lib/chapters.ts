import type { Chapter, ChapterIconKey } from "./types";

/**
 * Central chapter configuration — Soft Autumn palette.
 * Color table (matching the Android ChapterConfig):
 *  Psychiatry #2E6560 | Pain & Analgesics #C1613D | Antibiotics #6B6E3A
 *  Dermatology #C98572 | Cardiovascular #A13D2A | Urinary #6D4C52
 *  Respiratory #3F8C82 | GIT #4E6F63 | Others #A69572
 */

export const DARK_TEXT = "#2A1E18";

interface ChapterSeed {
  slug: string;
  name: string;
  arabicName: string;
  colorHex: string;
  icon: ChapterIconKey;
  tagline: string;
}

export const CHAPTER_ORDER: ChapterSeed[] = [
  { slug: "psychiatry", name: "Psychiatry", arabicName: "أعصاب / الطب النفسي", colorHex: "#2E6560", icon: "brain", tagline: "Mental health" },
  { slug: "pain-analgesics", name: "Pain & Analgesics", arabicName: "الألم والمسكنات", colorHex: "#C1613D", icon: "pill", tagline: "Pain management" },
  { slug: "antibiotics", name: "Antibiotics", arabicName: "المضادات الحيوية", colorHex: "#6B6E3A", icon: "syringe", tagline: "Infections" },
  { slug: "dermatology", name: "Dermatology", arabicName: "الأمراض الجلدية", colorHex: "#C98572", icon: "jar", tagline: "Skin & hair" },
  { slug: "cardiovascular", name: "Cardiovascular", arabicName: "القلب والأوعية الدموية", colorHex: "#A13D2A", icon: "heart", tagline: "Heart & vessels" },
  { slug: "urinary", name: "Urinary", arabicName: "المسالك البولية", colorHex: "#6D4C52", icon: "droplet", tagline: "Kidney & bladder" },
  { slug: "respiratory", name: "Respiratory", arabicName: "الجهاز التنفسي", colorHex: "#3F8C82", icon: "lungs", tagline: "Lungs & airway" },
  { slug: "git", name: "GIT", arabicName: "الجهاز الهضمي", colorHex: "#4E6F63", icon: "bowl", tagline: "Digestive system" },
  { slug: "others", name: "Others", arabicName: "أخرى", colorHex: "#A69572", icon: "grid", tagline: "Other cases" },
];

export function slugForCategory(category: string): string {
  return (
    CHAPTER_ORDER.find((c) => c.name === category)?.slug ??
    "others"
  );
}

export function categoryForSlug(slug: string): string {
  return CHAPTER_ORDER.find((c) => c.slug === slug)?.name ?? "Others";
}

export function getChapter(slug: string): Chapter | undefined {
  const seed = CHAPTER_ORDER.find((c) => c.slug === slug);
  if (!seed) return undefined;
  return { ...seed, count: 0 };
}

export function getChapterByCategory(category: string): ChapterSeed {
  return CHAPTER_ORDER.find((c) => c.name === category) ?? CHAPTER_ORDER[CHAPTER_ORDER.length - 1];
}

export function buildChapters(counts: Record<string, number>): Chapter[] {
  return CHAPTER_ORDER.map((c) => ({ ...c, count: counts[c.name] ?? 0 }));
}

/** Luminance of a #RRGGBB color (0..1), WCAG-style. */
function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const light = Math.max(la, lb);
  const dark = Math.min(la, lb);
  return (light + 0.05) / (dark + 0.05);
}

/** White unless the dark brown accent contrasts better with the chapter color. */
export function textColorFor(hex: string): string {
  return contrast("#FFFFFF", hex) >= contrast(DARK_TEXT, hex) ? "#FFFFFF" : DARK_TEXT;
}

export function chapterTextColor(category: string): string {
  return textColorFor(getChapterByCategory(category).colorHex);
}

export function isLightColor(hex: string): boolean {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 0.28;
}