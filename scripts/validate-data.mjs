/**
 * Validates src/data/prescriptions.json — the single source of truth.
 * Catches: duplicate/malformed ids, unknown categories, missing required
 * fields, category count drift, and broken rx row format.
 *
 * Usage: node scripts/validate-data.mjs  (also runs in `prebuild`).
 * Exits 1 on any failure so builds stop before shipping corrupted data.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Must mirror CHAPTER_ORDER in src/lib/chapters.ts.
const CATEGORIES = {
  Psychiatry: 8,
  "Pain & Analgesics": 8,
  Antibiotics: 7,
  Dermatology: 15,
  Cardiovascular: 8,
  Urinary: 8,
  Respiratory: 8,
  GIT: 9,
  Others: 1,
};

const REQUIRED_KEYS = ["id", "title", "subtitle", "content", "category", "chapterAr"];

const data = JSON.parse(readFileSync(join(root, "src/data/prescriptions.json"), "utf8"));
const errors = [];
const warn = (msg) => console.warn("  ⚠ " + msg);
const err = (msg) => errors.push(msg);

if (!Array.isArray(data)) err("prescriptions.json root is not an array");

if (Array.isArray(data)) {
  console.log(`Checking ${data.length} prescriptions…`);

  // 1. per-record shape
  const ids = new Set();
  for (const p of data) {
    for (const k of REQUIRED_KEYS) {
      if (typeof p[k] !== "string" || p[k].trim() === "") err(`${p.id ?? "?"}: missing/empty "${k}"`);
    }
    if (!/^rochetta-\d{3}$/.test(p.id ?? "")) err(`${p.id ?? "?"}: id must match rochetta-NNN`);
    if (ids.has(p.id)) err(`duplicate id: ${p.id}`);
    ids.add(p.id);
    if (!(p.category in CATEGORIES)) err(`${p.id}: unknown category "${p.category}"`);
    if (p.chapterAr && p.chapterAr.includes("[") && p.chapterAr.includes("]"))
      err(`${p.id}: chapterAr looks like raw content, got "${p.chapterAr}"`);

    // 2b. patient-mode fields (optional — added manually; tolerated when absent)
    if ("patient_diagnosis_summary" in p && (typeof p.patient_diagnosis_summary !== "string" || p.patient_diagnosis_summary.trim() === ""))
      err(`${p.id}: patient_diagnosis_summary must be a non-empty string when present`);
    if ("patient_interactions_summary" in p && (typeof p.patient_interactions_summary !== "string" || p.patient_interactions_summary.trim() === ""))
      err(`${p.id}: patient_interactions_summary must be a non-empty string when present`);
    if ("alarm_signs_patient" in p) {
      if (!Array.isArray(p.alarm_signs_patient) || p.alarm_signs_patient.some((s) => typeof s !== "string" || s.trim() === ""))
        err(`${p.id}: alarm_signs_patient must be an array of non-empty strings when present`);
    }

    // 2. content sanity
    const rxLines = p.content
      .split(/\r?\n/)
      .filter((l) => /^(?:-\s*)?[^\[]*\s*\|/.test(l));
    if (rxLines.length === 0) err(`${p.id}: no rx rows found in content`);
    const hasRxSection = /^\s*\[RX\]\s*$|^\s*\[RX[-:]/m.test(p.content);
    if (!hasRxSection) err(`${p.id}: content has no [RX-…] section`);
    const rxRowBroken = rxLines.filter((l) => l.split("|").length < 2);
    if (rxRowBroken.length) err(`${p.id}: broken rx rows (needs "drug | dose"): ${rxRowBroken.length}`);
  }

  // 3. category counts
  const counts = {};
  for (const p of data) counts[p.category] = (counts[p.category] ?? 0) + 1;
  for (const [cat, expected] of Object.entries(CATEGORIES)) {
    if (counts[cat] !== expected)
      warn(`${cat}: expected ${expected}, found ${counts[cat] ?? 0} (update CATEGORIES if intentional)`);
  }
  if (Object.keys(counts).length !== Object.keys(CATEGORIES).length)
    err("category set differs from chapters.ts");
}

if (errors.length) {
  console.error(`\n✖ validation failed — ${errors.length} error(s):`);
  for (const e of errors) console.error("  ✖ " + e);
  process.exit(1);
}
console.log("✔ prescriptions.json is valid");