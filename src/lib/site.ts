/**
 * Rochetta brand constants — single source for name, tagline, contact,
 * and site metadata used across components, layout, and social image.
 */

export const SITE_URL = "https://drahmedyousefmd-prog.github.io";

/** localStorage key persisting the doctor/patient mode choice. */
export const MODE_KEY = "rochetta-mode";

export const SITE = {
  name: "Rochetta",
  brandLine: "دليل روشتات مصر",
  taglineAr: "دليلك العملي للروشتات الطبية",
  taglineEn: "Your Practical Medical Prescription Guide",
  heroLine: "ابحث عن الحالة، شوف الدواء، البديل، والسعر في ثواني",
  description:
    "Rochetta — منصة عملية مرجعية للروشتات الطبية: دواء لكل حالة، التعليمات، البدائل، والتفاعلات. دليل روشتات مصر.",
  descriptionEn:
    "Rochetta is a practical medical prescription reference: medications, dosing instructions, alternatives, and interactions.",
  themeColor: "#1f5b54",
  backgroundColor: "#f7f5f1",
} as const;

export const CONTACT = {
  email: "dr.ahmed.yousef.md@gmail.com",
  mailtoSubmit: "mailto:dr.ahmed.yousef.md@gmail.com?subject=إضافة حالة طبية",
  gmailCompose: "https://mail.google.com/mail/?view=cm&fs=1&to=dr.ahmed.yousef.md@gmail.com",
  whatsapp: "https://wa.me/201121246814",
  phoneDisplay: "01121246814",
  linkedin: "https://www.linkedin.com/in/dr-ahmed-yousef/",
  creatorName: "د. أحمد يوسف",
  creatorRole: "منشئ ومطوّر Rochetta",
} as const;