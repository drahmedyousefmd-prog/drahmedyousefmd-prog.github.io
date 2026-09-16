import type { ContentSection } from "./types";

const AR_LABELS: Record<string, string> = {
  DIAGNOSIS: "التشخيص",
  INVESTIGATIONS: "الفحوصات والتشخيص المخبري",
  TREATMENT: "العلاج",
  WARNING: "تحذير",
};

/** Splits the markdown-ish [SECTION] content into sections. */
export function parseContent(content: string): ContentSection[] {
  if (!content) return [];
  const sections: ContentSection[] = [];
  let currentTag: ContentSection | null = null;

  const commit = () => {
    if (currentTag && currentTag.lines.length > 0) {
      sections.push(currentTag);
    }
    currentTag = null;
  };

  for (const rawLine of content.split(/\r?\n/)) {
    const bracket = /^\s*\[([^\]]+)\]\s*$/.exec(rawLine);
    if (bracket) {
      commit();
      const raw = bracket[1];
      const upper = raw.toUpperCase();
      const isRX = upper.startsWith("RX");
      const type: ContentSection["type"] = isRX
        ? "RX"
        : upper in AR_LABELS
          ? (upper as ContentSection["type"])
          : "OTHER";
      currentTag = {
        type,
        rawLabel: raw,
        displayLabel: isRX
          ? raw.replace(/^RX[:\s-]*/i, "")
          : upper in AR_LABELS
            ? AR_LABELS[upper]
            : raw,
        lines: [],
      };
      continue;
    }
    const trimmed = rawLine.trim();
    if (trimmed === "" && currentTag) {
      // blank lines keep grouping unless the next content is directly after
      continue;
    }
    if (currentTag) {
      currentTag.lines.push(trimmed);
    }
  }
  commit();
  return sections;
}

export interface RxLine {
  name: string;
  instruction: string; // Arabic dose / frequency
  price: string | null;
}

/** Parses " - Drug (Generic) | قرص مرة يوميا | 34.8 ج.م " rows. */
export function parseRxLines(lines: string[]): RxLine[] {
  return lines
    .map((line) => {
      const cleaned = line.replace(/^[-•]\s*/, "").trim();
      if (!cleaned) return null;
      const parts = cleaned.split("|").map((p) => p.trim());
      const name = parts[0] ?? "";
      const instruction = parts[1] ?? "";
      const price = parts.length > 2 ? parts[2] : null;
      return { name, instruction, price };
    })
    .filter((l): l is RxLine => l !== null && l.name.length > 0);
}

export interface DrugAlternative {
  name: string;
  price: string | null;
}

export interface PerDrugAlternatives {
  drugName: string;
  alternatives: DrugAlternative[];
}

/** Parses "Drug | price: Alt1 | p1, Alt2 | p2" blocks separated by newlines. */
export function parsePerDrugAlternatives(raw: string): PerDrugAlternatives[] {
  if (!raw) return [];
  const result: PerDrugAlternatives[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const cleaned = line.trim();
    if (!cleaned) continue;
    const idx = cleaned.indexOf(":");
    const main = (idx === -1 ? cleaned : cleaned.slice(0, idx)).trim();
    const alts = idx === -1 ? "" : cleaned.slice(idx + 1);
    const list = alts
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean)
      .map((a) => {
        const p = a.split("|").map((x) => x.trim());
        return { name: p[0] ?? "", price: p.length > 1 ? p[1] : null };
      });
    if (main) result.push({ drugName: main, alternatives: list });
  }
  return result;
}

export interface GenericAlternative {
  name: string;
  price: string | null;
}

/** Parses the alternatives list (one per line: "Name | price"). */
export function parseAlternatives(raw: string): GenericAlternative[] {
  if (!raw) return [];
  return raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const p = l.split("|").map((x) => x.trim());
      return { name: p[0] ?? "", price: p.length > 1 ? p[1] : null };
    });
}

export interface InteractionGroup {
  title: string;
  severity: "danger" | "warning";
  text: string;
}

/** Parses drugInteraction / instruction blocks into (title, severity, text) groups. */
export function parseSeverityBlocks(raw: string): InteractionGroup[] {
  if (!raw) return [];
  const groups: InteractionGroup[] = [];
  let current: InteractionGroup | null = null;
  for (const rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) {
      current = null;
      continue;
    }
    const danger = line.includes("❌");
    const warn = line.includes("⚠️");
    if (danger || warn) {
      groups.push({
        title: line.replace(/^[❌⚠️\s]+/, "").trim(),
        severity: danger ? "danger" : "warning",
        text: "",
      });
      current = groups[groups.length - 1];
      continue;
    }
    if (current) {
      current.text = (current.text + " " + line).trim();
    }
  }
  return groups.filter((g) => g.title);
}

/** Splits generic instruction/note lines keeping ❌/⚠️/✅ markers. */
export interface BulletLine {
  text: string;
  tone: "ok" | "warn" | "danger" | "info";
}

export function parseBulletLines(raw: string): BulletLine[] {
  if (!raw) return [];
  return raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const tone = l.includes("❌") ? "danger" : l.includes("⚠️") ? "warn" : l.includes("✅") ? "ok" : "info";
      return { text: l.replace(/^[✅⚠️❌]\s*/, ""), tone };
    });
}