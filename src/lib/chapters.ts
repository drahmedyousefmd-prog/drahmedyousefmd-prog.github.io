import type { Chapter, ChapterIconKey } from "./types";

/**
 * Central chapter configuration.
 * Category colors (quiet tints on the site — not loud fills):
 *  Psychiatry #6E5DB3 | Pain & Analgesics #C1652B | Antibiotics #7A8C3F
 *  Dermatology #B4736A | Cardiovascular #B23B3B | Urinary #6B5B73
 *  Respiratory #3E7EA6 | GIT #4A8B7C | Others #6B6B6B
 */

export const DARK_TEXT = "#1E2321";

interface ChapterSeed {
  slug: string;
  name: string;
  arabicName: string;
  colorHex: string;
  icon: ChapterIconKey;
  tagline: string;
}

export const CHAPTER_ORDER: ChapterSeed[] = [
  { slug: "psychiatry", name: "Psychiatry", arabicName: "أعصاب / الطب النفسي", colorHex: "#6E5DB3", icon: "brain", tagline: "Mental health" },
  { slug: "pain-analgesics", name: "Pain & Analgesics", arabicName: "الألم والمسكنات", colorHex: "#C1652B", icon: "pill", tagline: "Pain management" },
  { slug: "antibiotics", name: "Antibiotics", arabicName: "المضادات الحيوية", colorHex: "#7A8C3F", icon: "syringe", tagline: "Infections" },
  { slug: "dermatology", name: "Dermatology", arabicName: "الأمراض الجلدية", colorHex: "#B4736A", icon: "jar", tagline: "Skin & hair" },
  { slug: "cardiovascular", name: "Cardiovascular", arabicName: "القلب والأوعية الدموية", colorHex: "#B23B3B", icon: "heart", tagline: "Heart & vessels" },
  { slug: "urinary", name: "Urinary", arabicName: "المسالك البولية", colorHex: "#6B5B73", icon: "droplet", tagline: "Kidney & bladder" },
  { slug: "respiratory", name: "Respiratory", arabicName: "الجهاز التنفسي", colorHex: "#3E7EA6", icon: "lungs", tagline: "Lungs & airway" },
  { slug: "git", name: "GIT", arabicName: "الجهاز الهضمي", colorHex: "#4A8B7C", icon: "bowl", tagline: "Digestive system" },
  { slug: "others", name: "Others", arabicName: "أخرى", colorHex: "#6B6B6B", icon: "grid", tagline: "Other cases" },
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