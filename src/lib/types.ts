export interface Prescription {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  category: string;
  chapterAr: string;
  alternatives: string;
  perDrugAlternatives: string;
  drugInstructions: string;
  drugInteractions: string;
}

export type ChapterIconKey =
  | "brain"
  | "pill"
  | "syringe"
  | "jar"
  | "heart"
  | "droplet"
  | "lungs"
  | "bowl"
  | "grid";

export interface Chapter {
  slug: string;
  name: string;
  arabicName: string;
  colorHex: string;
  icon: ChapterIconKey;
  tagline: string;
  count: number;
}

export interface ContentSection {
  type: "DIAGNOSIS" | "INVESTIGATIONS" | "TREATMENT" | "WARNING" | "RX" | "OTHER";
  rawLabel: string; // e.g. "RX-الروشتة — 1st line"
  displayLabel: string;
  lines: string[];
}