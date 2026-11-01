/**
 * Rochetta brand constants — single source for name, tagline, contact,
 * and site metadata used across components, layout, and social image.
 */

export const SITE_URL = "https://drahmedyousefmd-prog.github.io";

/** The separate patient-consultation site («استشارة»). GitHub Pages project
 *  URL (Phase-6 final — no custom domain for now). */
export const PATIENT_SITE_URL = "https://drahmedyousefmd-prog.github.io/estesharah";

/** Namespace for every browser-storage key. Both sites share the same GitHub
 *  Pages ORIGIN, so localStorage is shared — the prefix prevents collisions
 *  with the patient site (`estesharah:`). */
export const STORAGE_PREFIX = "rochetta:";

/** localStorage key persisting the doctor/patient mode choice. */
export const MODE_KEY = `${STORAGE_PREFIX}mode`;

export const SITE = {
  name: "Rochetta",
  /** Arabic brand name shown in titles/metadata (the visual logo stays "Rochetta"). */
  nameAr: "روشتة",
  brandLine: "دليل الطبيب",
  taglineAr: "دليلك كطبيب إلى أحدث الروشتات الطبية",
  taglineEn: "Your Practical Medical Prescription Guide",
  /** Full <title> for the landing page — English brand name first. */
  homeTitle: "Rochetta | روشتة — دليل الطبيب لأحدث الروشتات والأدوية في مصر",
  /** Names used for the WebSite structured-data node (schema.org alternateName). */
  alternateNames: ["روشتة", "Rochetta Egypt", "روشتات مصر"],
  heroLine:
    "Rochetta (روشتة) دليل مرجعي للأطباء في مصر لأحدث الروشتات والأصناف الدوائية — ابحث عن الحالة، شوف الدواء، البديل، والسعر في ثوانٍ.",
  description:
    "Rochetta (روشتة): دليل الطبيب لأحدث الروشتات الطبية والأصناف الدوائية في مصر — جرعات، أسعار، بدائل وتداخلات دوائية.",
  descriptionEn:
    "Rochetta is a practical medical prescription reference: medications, dosing instructions, alternatives, and interactions.",
  themeColor: "#2563eb",
  backgroundColor: "#f8fbff",
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

/** The responsible physician — used in structured data (schema.org Person).
 *  Only real, provided values; no invented credentials or ratings. */
export const DOCTOR = {
  name: CONTACT.creatorName,
  jobTitle: "Physician",
  sameAs: [CONTACT.linkedin],
} as const;

/** Reference keywords — used naturally in headings and copy (meta keywords are
 *  ignored by search engines, so these are never emitted as a <meta> tag). */
export const KEYWORDS_AR = [
  "روشتة",
  "دليل الطبيب",
  "أحدث الأدوية في مصر",
  "الأصناف الدوائية الحديثة",
  "بدائل الأدوية",
  "جرعات الأدوية",
  "التداخلات الدوائية",
  "أسعار الأدوية في مصر",
] as const;

export const KEYWORDS_EN = [
  "Rochetta",
  "Egypt drug guide",
  "prescription guide for physicians",
  "drug interactions",
  "maximum dose",
  "Egyptian drug prices",
] as const;