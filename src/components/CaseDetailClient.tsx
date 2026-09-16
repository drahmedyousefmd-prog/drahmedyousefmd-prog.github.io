"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { X, ChevronDown } from "lucide-react";
import { addRecent } from "@/lib/recents";
import type { ChapterIconKey } from "@/lib/types";
import type {
  RxLine,
  InteractionGroup,
  PerDrugAlternatives,
  BulletLine,
} from "@/lib/content";
import {
  ChapterIcon,
  BackIcon,
  PrintIcon,
  PillIcon,
  OctagonAlertIcon,
  TriangleAlertIcon,
  CircleCheckIcon,
} from "./icons";
import { navigateWithTransition } from "@/lib/transition";

export interface ClinicalTab {
  type: "DIAGNOSIS" | "INVESTIGATIONS" | "TREATMENT";
  label: string;
  lines: string[];
}

export interface RxGroup {
  label: string;
  rows: RxLine[];
}

export function CaseDetailClient({
  id,
  title,
  subtitle,
  chapter,
  clinical,
  warning,
  rxGroups,
  perDrug,
  interactions,
  instructions,
}: {
  id: string;
  title: string;
  subtitle: string | null;
  chapter: {
    slug: string;
    name: string;
    arabicName: string;
    colorHex: string;
    icon: ChapterIconKey;
  };
  clinical: ClinicalTab[];
  warning: string[] | null;
  rxGroups: RxGroup[];
  perDrug: PerDrugAlternatives[];
  interactions: InteractionGroup[];
  instructions: BulletLine[];
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [openAcc, setOpenAcc] = useState<Record<string, boolean>>({});
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => addRecent(id, title), 0);
    return () => clearTimeout(timer);
  }, [id, title]);

  const tabs = clinical.length > 0 ? clinical : [];

  const rxCol = (
    <div>
      <div className="badge-label">
        <PillIcon />
        الروشتة الحالية
      </div>

      {rxGroups.length === 0 && (
        <p className="text-[14px] text-[var(--text-muted)]">لا توجد وصفة مسجلة</p>
      )}

      {rxGroups.map((g) => (
        <div key={g.label} className="mb-5">
          <div className="mb-2.5 text-[12px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
            {g.label}
          </div>
          {g.rows.map((row) => (
            <DrugRow
              key={row.name + row.instruction}
              row={row}
              groupKey={g.label}
              perDrug={perDrug}
              openAcc={openAcc}
              onToggle={setOpenAcc}
            />
          ))}
        </div>
      ))}

      {interactions.length > 0 && (
        <div className="mt-6">
          <div className="badge-label">
            <OctagonAlertIcon />
            التفاعلات الدوائية
          </div>
          <div className="space-y-2">
            {interactions.map((g) => (
              <div
                key={g.title}
                className={`interaction-card ${g.severity}${
                  g.severity === "danger" ? " shake" : ""
                }`}
              >
                {g.severity === "danger" ? (
                  <OctagonAlertIcon className="h-[18px] w-[18px]" />
                ) : (
                  <TriangleAlertIcon className="h-[18px] w-[18px]" />
                )}
                <div>
                  <div className="font-bold">{g.title}</div>
                  {g.text && <div className="mt-0.5">{g.text}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {instructions.length > 0 && (
        <div className="mt-6">
          <div className="badge-label">
            <CircleCheckIcon />
            تعليمات الاستخدام
          </div>
          <ul className="flex flex-col gap-2">
            {instructions.map((b) => (
              <li key={b.text} className="flex items-start gap-2 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{
                    background:
                      b.tone === "danger"
                        ? "var(--status-danger)"
                        : b.tone === "warn"
                          ? "var(--status-warning)"
                          : b.tone === "ok"
                            ? "var(--status-safe)"
                            : "var(--text-muted)",
                  }}
                />
                <span>{b.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rx-actions no-print">
        <button type="button" className="btn-primary" onClick={() => window.print()}>
          <PrintIcon className="h-[18px] w-[18px]" />
          تصدير PDF
        </button>
        <Link
          href="/"
          className="btn-ghost"
          onClick={(e) => {
            if (typeof document !== "undefined" && typeof document.startViewTransition === "function") {
              e.preventDefault();
              navigateWithTransition("/");
            }
          }}
        >
          <BackIcon className="h-[18px] w-[18px]" />
          الرئيسية
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh">
      {/* Header */}
      <header className="case-header">
        <div className="mx-auto flex w-full max-w-[1200px] items-start gap-3 px-4 py-4 sm:px-6">
          <Link
            href={`/chapter/${chapter.slug}`}
            className="no-print mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
            aria-label="رجوع للفصل"
          >
            <BackIcon className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <Link
              href={`/chapter/${chapter.slug}`}
              className="chapter-chip no-print"
              style={{ "--cat": chapter.colorHex } as CSSProperties}
            >
              <ChapterIcon name={chapter.icon} className="h-3.5 w-3.5" />
              {chapter.arabicName}
            </Link>
            <h1 className="font-en case-title mt-1.5">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="case-layout">
        {/* Clinical column */}
        <section className="case-clinical-col">
          {warning && warning.length > 0 && (
            <div className="mb-5 interaction-card warning">
              <TriangleAlertIcon className="h-[18px] w-[18px]" />
              <div>
                <div className="font-bold">تحذير</div>
                {warning.map((w) => (
                  <div key={w} className="mt-0.5">
                    {w}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tabs.length > 0 && (
            <>
              <div className="case-tabs" role="tablist">
                {tabs.map((t, i) => (
                  <button
                    key={t.type}
                    type="button"
                    role="tab"
                    aria-selected={i === activeTab}
                    className={`case-tab ${i === activeTab ? "active" : ""}`}
                    onClick={() => setActiveTab(i)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="mt-5">
                {tabs.map((t, i) => (
                  <div
                    key={t.type}
                    role="tabpanel"
                    className={`tab-panel ${i === activeTab ? "" : "hidden"}`}
                  >
                    <ul className="clinical-list">
                      {t.lines.map((l) => (
                        <li key={l}>{l}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Rx column — desktop sticky */}
        <aside className="case-rx-col no-print">{rxCol}</aside>
      </div>

      {/* Mobile FAB */}
      <button
        type="button"
        className="rx-fab no-print"
        onClick={() => setSheetOpen(true)}
        aria-label="فتح الروشتة"
      >
        <PillIcon className="h-[18px] w-[18px]" />
        الروشتة
      </button>

      {/* Mobile bottom sheet */}
      {sheetOpen && (
        <div className="sheet-backdrop no-print" onClick={() => setSheetOpen(false)} />
      )}
      <div
        className={`sheet no-print ${sheetOpen ? "" : "closed"}`}
        role="dialog"
        aria-label="الروشتة الحالية"
        aria-hidden={!sheetOpen}
      >
        <div className="sheet-handle" />
        <button
          type="button"
          className="sheet-close"
          onClick={() => setSheetOpen(false)}
          aria-label="إغلاق"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
        <div className="clear-both pt-2">{rxCol}</div>
      </div>
    </div>
  );
}

function DrugRow({
  row,
  groupKey,
  perDrug,
  openAcc,
  onToggle,
}: {
  row: RxLine;
  groupKey: string;
  perDrug: PerDrugAlternatives[];
  openAcc: Record<string, boolean>;
  onToggle: (cb: (prev: Record<string, boolean>) => Record<string, boolean>) => void;
}) {
  const match = (() => {
    const firstWord = row.name.split(" ")[0].toLowerCase();
    return perDrug.find(
      (p) => p.drugName.split(" ")[0].toLowerCase() === firstWord
    );
  })();
  const alts = match?.alternatives ?? [];
  const key = `${groupKey}::${row.name}`;
  const open = Boolean(openAcc[key]);

  return (
    <div className="mb-2.5">
      <div className="rx-primary">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="rx-drug-name">{row.name}</div>
            {row.instruction && (
              <div className="rx-instruction mt-0.5">{row.instruction}</div>
            )}
          </div>
          {row.price && <span className="rx-price">{row.price}</span>}
        </div>
      </div>

      {alts.length > 0 && (
        <div className="mt-1.5">
          <button
            type="button"
            className={`acc-toggle ${open ? "open" : ""}`}
            onClick={() =>
              onToggle((prev) => ({ ...prev, [key]: !prev[key] }))
            }
          >
            <span>
              {open
                ? "إخفاء البدائل"
                : `عرض ${alts.length} بديل${alts.length === 1 ? "" : "ات"}`}
            </span>
            <ChevronDown className="h-4 w-4" strokeWidth={2} />
          </button>
          <div
            className="acc-panel"
            style={{ maxHeight: open ? 500 : 0 }}
            aria-hidden={!open}
          >
            <table className="alt-table">
              <thead>
                <tr>
                  <th>البديل</th>
                  <th className="text-end">السعر</th>
                </tr>
              </thead>
              <tbody>
                {alts.map((a) => (
                  <tr key={a.name + (a.price ?? "")}>
                    <td className="alt-name">{a.name}</td>
                    <td className="alt-price text-end">{a.price ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}