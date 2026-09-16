"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ChevronDown, Siren } from "lucide-react";
import { addRecent } from "@/lib/recents";
import { useMode } from "@/lib/mode";
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
  LogoGlyph,
  PillIcon,
  ClipboardListIcon,
  OctagonAlertIcon,
  TriangleAlertIcon,
  CircleCheckIcon,
} from "./icons";
import { SITE } from "@/lib/site";
import { BackLink } from "./portal/BackLink";
import { handleTransitionNav } from "@/lib/transition";
import { Tabs, type TabItem } from "./ui/Tabs";
import { ModeSwitch } from "./ModeSwitch";
import { Sheet } from "./ui/Sheet";
import { Alert } from "./ui/Alert";
import { Table } from "./ui/Table";
import { RxCard } from "./ui/RxCard";

export interface ClinicalTab {
  type: "DIAGNOSIS" | "INVESTIGATIONS" | "TREATMENT";
  label: string;
  lines: string[];
}

export interface RxGroup {
  label: string;
  rows: RxLine[];
}

const CLINICAL_TAB_COLOR: Record<ClinicalTab["type"], string> = {
  DIAGNOSIS: "var(--accent)",
  INVESTIGATIONS: "var(--tab-clinical)",
  TREATMENT: "var(--tab-rx)",
};

const RX_TABS: ("rx" | "instructions" | "interactions")[] = [
  "rx",
  "instructions",
  "interactions",
];

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
  patient,
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
  patient: {
    diagnosisSummary: string;
    interactionsSummary: string;
    alarmSigns: string[];
  };
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [rxTab, setRxTab] = useState(0);
  const [openAcc, setOpenAcc] = useState<Record<string, boolean>>({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const { mode } = useMode();
  const isPatient = mode !== "doctor";

  useEffect(() => {
    const timer = setTimeout(() => addRecent(id, title), 0);
    return () => clearTimeout(timer);
  }, [id, title]);

  const tabs = clinical;
  const rxDrugCount = rxGroups.reduce((n, g) => n + g.rows.length, 0);
  const activeRxKey = RX_TABS[rxTab] ?? "rx";

  const PATIENT_DIAGNOSIS_PLACEHOLDER =
    "هذا الشرح المبسّط قيد الإضافة — لا تتردد في سؤال طبيبك مباشرة عن حالتك.";
  const PATIENT_INVESTIGATIONS_TEXT =
    "قد يوصي طبيبك ببعض الفحوصات لتأكيد التشخيص أو متابعة علاجك، وسيشرح لك ما تحتاجه وقت الزيارة.";
  const PATIENT_INTERACTIONS_PLACEHOLDER =
    "إلى أن يُضاف الشرح المبسّط، استشر طبيبك أو الصيدلي قبل إضافة أي دواء جديد إلى علاجك الحالي.";

  const clinicalItems: TabItem[] = (() => {
    if (!isPatient) {
      return tabs.map((t) => ({
        key: t.type,
        label: t.label,
        color: CLINICAL_TAB_COLOR[t.type],
        content: (
          <div className="mt-5">
            <ul className="clinical-list">
              {t.lines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        ),
      }));
    }

    const items: TabItem[] = [
      {
        key: "DIAGNOSIS",
        label: "الشرح",
        color: CLINICAL_TAB_COLOR.DIAGNOSIS,
        content: (
          <p className="patient-paragraph">
            {patient.diagnosisSummary || PATIENT_DIAGNOSIS_PLACEHOLDER}
          </p>
        ),
      },
    ];
    if (tabs.some((t) => t.type === "INVESTIGATIONS")) {
      items.push({
        key: "INVESTIGATIONS",
        label: "الفحوصات",
        color: CLINICAL_TAB_COLOR.INVESTIGATIONS,
        content: <p className="patient-paragraph">{PATIENT_INVESTIGATIONS_TEXT}</p>,
      });
    }
    return items;
  })();

  const rxCol = (
    <div>
      <Tabs
        ariaLabel="الروشتة"
        tablistCls="rx-tabs"
        tabCls="rx-tab"
        panelCls="rx-panel"
        active={rxTab}
        onActive={setRxTab}
        items={[
          {
            key: "rx",
            label: (
              <>
                <PillIcon className="h-4 w-4" />
                الروشتة
              </>
            ),
            badge: rxDrugCount,
            color: "var(--accent)",
            content:
              rxGroups.length === 0 ? (
                <p className="text-[14px] text-[var(--text-muted)]">
                  لا توجد وصفة مسجلة
                </p>
              ) : (
                rxGroups.map((g) => (
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
                        isPatient={isPatient}
                      />
                    ))}
                  </div>
                ))
              ),
          },
          {
            key: "instructions",
            label: (
              <>
                <ClipboardListIcon className="h-4 w-4" />
                تعليمات الاستخدام
              </>
            ),
            badge: instructions.length,
            color: "var(--tab-warning)",
            content:
              instructions.length === 0 ? (
                <p className="text-[14px] text-[var(--text-muted)]">
                  لا توجد تعليمات مسجلة
                </p>
              ) : (
                <div className="instructions-panel">
                  {instructions.map((b) => (
                    <div key={b.text} className="instr-line">
                      <CircleCheckIcon
                        className={`${
                          b.tone === "ok"
                            ? "tone-ok"
                            : b.tone === "warn"
                              ? "tone-warn"
                              : b.tone === "danger"
                                ? "tone-danger"
                                : ""
                        }`}
                      />
                      <span>{b.text}</span>
                    </div>
                  ))}
                </div>
              ),
          },
          {
            key: "interactions",
            label: (
              <>
                <TriangleAlertIcon className="h-4 w-4" />
                التفاعلات
              </>
            ),
            badge: isPatient
              ? patient.interactionsSummary
                ? 1
                : undefined
              : interactions.length,
            color: "var(--status-danger)",
            content:
              isPatient ? (
                patient.interactionsSummary ? (
                  <Alert
                    tone="warning"
                    icon={
                      <TriangleAlertIcon className="h-[18px] w-[18px]" />
                    }
                    title="تفاعلات — شرح مبسّط"
                  >
                    {patient.interactionsSummary}
                  </Alert>
                ) : (
                  <Alert
                    tone="info"
                    icon={
                      <TriangleAlertIcon className="h-[18px] w-[18px]" />
                    }
                    title="شرح التفاعلات قيد الإضافة"
                  >
                    {PATIENT_INTERACTIONS_PLACEHOLDER}
                  </Alert>
                )
              ) : interactions.length === 0 ? (
                <p className="text-[14px] text-[var(--text-muted)]">
                  لا توجد تفاعلات مسجلة
                </p>
              ) : (
                <div className="space-y-2">
                  {interactions.map((g) => (
                    <Alert
                      key={g.title}
                      tone={g.severity === "danger" ? "danger" : "warning"}
                      shake={g.severity === "danger" && activeRxKey === "interactions"}
                      icon={
                        g.severity === "danger" ? (
                          <OctagonAlertIcon className="h-[18px] w-[18px]" />
                        ) : (
                          <TriangleAlertIcon className="h-[18px] w-[18px]" />
                        )
                      }
                      title={g.title}
                    >
                      {g.text}
                    </Alert>
                  ))}
                </div>
              ),
          },
        ]}
      />

      <div className="rx-actions no-print">
        <button type="button" className="btn btn-primary" onClick={() => window.print()}>
          <PrintIcon className="h-[18px] w-[18px]" />
          تصدير PDF
        </button>
        <Link
          href="/"
          className="btn btn-ghost"
          onClick={handleTransitionNav}
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
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-start gap-3 px-4 py-4 sm:px-6">
          <Link href="/" className="site-logo case-logo no-print" aria-label={`${SITE.name} — الرئيسية`}>
            <span className="site-logo-chip">
              <LogoGlyph className="h-5 w-5" />
            </span>
            <span className="hidden sm:inline">{SITE.name}</span>
          </Link>
          <BackLink
            href={`/doctor/chapter/${chapter.slug}`}
            className="no-print mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            label="رجوع إلى الصفحة السابقة"
          >
            <BackIcon className="h-4 w-4" />
          </BackLink>
          <div className="min-w-0">
            <Link
              href={`/doctor/chapter/${chapter.slug}`}
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

      <div className="case-mode-bar no-print">
        <ModeSwitch />
      </div>

      <div className="case-layout">
        {/* Clinical column */}
        <section className="case-clinical-col">
          {!isPatient && warning && warning.length > 0 && (
            <Alert
              className="mb-5"
              tone="warning"
              icon={<TriangleAlertIcon className="h-[18px] w-[18px]" />}
              title="تحذير"
            >
              {warning.map((w) => (
                <div key={w}>{w}</div>
              ))}
            </Alert>
          )}

          {isPatient && patient.alarmSigns.length > 0 && (
            <div className="alarm-signs-card mb-5" role="note">
              <div className="alarm-signs-title">
                <Siren className="h-5 w-5" aria-hidden="true" />
                لاحظ هذه العلامات بعد بدء العلاج
              </div>
              <ul className="alarm-signs-list">
                {patient.alarmSigns.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <p className="alarm-signs-note">
                إذا ظهرت أي من هذه العلامات، توقف وافحص حالتك — وفي وجود علامة خطيرة راجع أقرب طبيب أو طوارئ فورًا.
              </p>
            </div>
          )}

          {clinicalItems.length > 0 ? (
            <Tabs
              ariaLabel={isPatient ? "الشرح الموفّر للمريض" : "البيانات السريرية"}
              tablistCls="case-tabs"
              tabCls="case-tab"
              panelCls="tab-panel"
              active={Math.min(activeTab, clinicalItems.length - 1)}
              onActive={setActiveTab}
              items={clinicalItems}
            />
          ) : (
            <p className="mt-1 rounded-2xl border border-dashed border-[var(--border)] p-4 text-[15px] leading-relaxed text-[var(--text-secondary)]">
              لا يتوفر محتوى لهذه الحالة حالياً.
            </p>
          )}

          {isPatient && (
            <p className="patient-disclaimer no-print">
              هذا الدليل للمساعدة على فهم الحالة والدواء، وهو ليس بديلاً عن نصيحة
              طبيبك المعالج.
            </p>
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
      <Sheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        label="الروشتة الحالية"
      >
        {rxCol}
      </Sheet>
    </div>
  );
}

function DrugRow({
  row,
  groupKey,
  perDrug,
  openAcc,
  onToggle,
  isPatient,
}: {
  row: RxLine;
  groupKey: string;
  perDrug: PerDrugAlternatives[];
  openAcc: Record<string, boolean>;
  onToggle: (cb: (prev: Record<string, boolean>) => Record<string, boolean>) => void;
  isPatient: boolean;
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
      <RxCard name={row.name} instruction={row.instruction} price={row.price} />

      {alts.length > 0 && (
        <div className="mt-1.5">
          <button
            type="button"
            className={`acc-toggle ${open ? "open" : ""}`}
            aria-expanded={open}
            onClick={() =>
              onToggle((prev) => ({ ...prev, [key]: !prev[key] }))
            }
          >
            <span>
              {open
                ? "إخفاء البدائل"
                : isPatient
                  ? "بدائل متاحة"
                  : `عرض ${alts.length} بديل${alts.length === 1 ? "" : "ات"}`}
            </span>
            <ChevronDown className="h-4 w-4" strokeWidth={2} />
          </button>
          <div
            className="acc-panel"
            style={{ maxHeight: open ? 500 : 0 }}
            aria-hidden={!open}
          >
            <Table
              className="alt-table"
              columns={[
                { header: "البديل" },
                { header: "السعر", className: "text-end" },
              ]}
              rows={alts.map((a) => ({
                cells: [
                  <span key={`${a.name}-n`} className="alt-name">
                    {a.name}
                  </span>,
                  <span key={`${a.name}-p`} className="alt-price">
                    {a.price ?? "—"}
                  </span>,
                ],
                cellClassNames: [undefined, "text-end"],
              }))}
            />
          </div>
        </div>
      )}
    </div>
  );
}