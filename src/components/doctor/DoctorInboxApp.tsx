"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Inbox, RotateCcw, SendHorizonal, CheckCircle2, Lock, AlertTriangle } from "lucide-react";
import {
  addMessage,
  allTickets,
  setTicketStatus,
  usePortal,
  type Ticket,
} from "@/lib/portal-store";
import { SERVICE_TABS, serviceLabel } from "@/lib/services";
import { PortalTopbar } from "../portal/PortalTopbar";
import { StatusChip, formatDate, lastMessagePreview } from "../portal/ticket-utils";

type ServiceFilter = "all" | (typeof SERVICE_TABS)[number]["type"];
type StatusFilter = "all" | "pending" | "answered" | "closed";

export function DoctorInboxApp() {
  const { pendingCounts, doctorPendingTotal } = usePortal();
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const tickets = allTickets();
  const filtered = tickets.filter(
    (t) =>
      (serviceFilter === "all" || t.service_type === serviceFilter) &&
      (statusFilter === "all" || t.status === statusFilter)
  );
  const open = openId ? tickets.find((t) => t.ticket_id === openId) : undefined;

  return (
    <div className="min-h-dvh" id="top">
      <PortalTopbar
        title="طلبات المرضى"
        links={
          <Link href="/doctor/categories" className="portal-topbar-link">
            الدليل
          </Link>
        }
        right={
          doctorPendingTotal > 0 && (
            <span className="pending-pill" aria-label={`${doctorPendingTotal} طلب بانتظار الرد`}>
              {doctorPendingTotal} معلّق
            </span>
          )
        }
      />

      <main className="mx-auto w-full max-w-[1100px] px-4 pb-16 pt-8 sm:px-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-extrabold text-[var(--text-primary)]">طلبات المرضى</h1>
            <p className="text-[13px] text-[var(--text-secondary)]">
              تذاكر الخدمات — أجب داخل الشات، وتُرسل نسخة للمريض بالبريد كإشعار
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ["all", "الكل"],
                ["pending", "معلّق"],
                ["answered", "تم الرد"],
                ["closed", "مغلقة"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={`rounded-full px-3 py-1.5 text-[12px] font-bold transition ${statusFilter === key ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]"}`}
                onClick={() => setStatusFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {[{ type: "all" as const, label: "كل الخدمات" }, ...SERVICE_TABS].map((tab) => {
            const count = tab.type === "all" ? null : pendingCounts[tab.type] ?? 0;
            const active = serviceFilter === tab.type;
            return (
              <button
                key={tab.type}
                type="button"
                className={`inbox-tab ${active ? "active" : ""}`}
                onClick={() => setServiceFilter(tab.type)}
              >
                {tab.label}
                {count !== null && count > 0 && (
                  <span className="pending-badge">{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center text-[var(--text-muted)]">
            <Inbox className="h-10 w-10 opacity-40" aria-hidden="true" />
            <span className="text-sm">لا توجد طلبات هنا بعد — لأغراض العرض يمكنك إرسال طلب من بوابة المريض.</span>
            <p className="text-[12px]">
              ملاحظة: النظام محلي على الجهاز — الطلبات تُخزَّن في متصفح المريض نفسه.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {filtered.map((t) => (
              <li key={t.ticket_id}>
                <button
                  type="button"
                  onClick={() => setOpenId(t.ticket_id)}
                  className="ticket-row card w-full text-start"
                >
                  <span className="flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <b className="text-[15px] text-[var(--text-primary)]">
                        {serviceLabel(t.service_type)}
                      </b>
                      <StatusChip status={t.status} />
                      {t.status === "pending" && (
                        <span className="text-[12px] font-bold text-[var(--status-warning)]">
                          • بحاجة لرد
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-[13px] text-[var(--text-secondary)]">
                      المريض: {t.patient_profile.name || t.patient_profile.identifier}
                    </span>
                    <span className="mt-0.5 block truncate text-[13px] text-[var(--text-secondary)]">
                      {lastMessagePreview(t)}
                    </span>
                    <span className="mt-0.5 block text-[12px] text-[var(--text-muted)]" dir="ltr">
                      {t.ticket_id} • {formatDate(t.created_at)}
                    </span>
                  </span>
                  <ArrowLeft className="h-4 w-4 shrink-0 text-[var(--text-muted)]" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      {open && (
        <DoctorTicketChat ticket={open} onBack={() => setOpenId(null)} />
      )}
    </div>
  );
}

function DoctorTicketChat({ ticket, onBack }: { ticket: Ticket; onBack: () => void }) {
  const [draft, setDraft] = useState("");
  const [saveFlash, setSaveFlash] = useState(false);

  const flash = (setter: (v: boolean) => void) => {
    setter(true);
    window.setTimeout(() => setter(false), 2200);
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    addMessage(ticket.ticket_id, "doctor", draft);
    setDraft("");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-[var(--bg)]">
      <div className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1 text-[13px] font-bold text-[var(--text-secondary)] transition hover:text-[var(--accent)]"
        >
          → العودة للطلب
        </button>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[20px] font-extrabold text-[var(--text-primary)]">
              {serviceLabel(ticket.service_type)}
            </h1>
            <p className="text-[13px] text-[var(--text-muted)]" dir="ltr">
              {ticket.ticket_id} • {formatDate(ticket.created_at)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusChip status={ticket.status} />
            {ticket.status === "answered" && (
              <button
                type="button"
                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-[13px] font-bold text-[var(--text-secondary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                onClick={() => flash(setSaveFlash)}
              >
                <CheckCircle2 className="inline h-4 w-4" aria-hidden="true" /> سُنِّيت الإجابة
              </button>
            )}
            {ticket.status === "closed" ? (
              <button
                type="button"
                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-[13px] font-bold text-[var(--text-secondary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                onClick={() => setTicketStatus(ticket.ticket_id, "pending")}
              >
                <RotateCcw className="inline h-4 w-4" aria-hidden="true" /> إعادة فتح
              </button>
            ) : (
              <button
                type="button"
                className="rounded-full border border-[var(--status-danger)] bg-transparent px-4 py-2 text-[13px] font-bold text-[var(--status-danger)] transition hover:bg-[color-mix(in srgb,var(--status-danger)_8%,transparent)]"
                onClick={() => setTicketStatus(ticket.ticket_id, "closed")}
              >
                إغلاق التذكرة
              </button>
            )}
          </div>
        </div>

        {saveFlash && (
          <p className="mt-2 text-[13px] font-bold text-[var(--accent)]">
            ✓ الإجابة محفوظة — تذكرة بحالة «تم الرد».
          </p>
        )}

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
          <section className="chat-shell" aria-label="الشات">
            <div className="chat-thread">
              {ticket.messages.length === 0 && (
                <p className="chat-empty">لا رسائل بعد — ابدأ الرد الأول هنا.</p>
              )}
              {ticket.messages.map((m, i) => (
                <div key={i} className={`chat-bubble ${m.sender}`}>
                  <p>{m.text}</p>
                  <span>{m.sender === "doctor" ? "نحن (الطبيب)" : ticket.patient_profile.name || "المريض"} • {formatDate(m.timestamp)}</span>
                </div>
              ))}
            </div>
            <form className="chat-composer" onSubmit={send}>
              <textarea
                dir="rtl"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="اكتب ردك للمريض… (يرفع التذكرة إلى «تم الرد» تلقائيًا)"
                aria-label="رد الطبيب"
                className="chat-input"
                rows={2}
              />
              <button type="submit" className="btn-pill primary" aria-label="إرسال الرد">
                <SendHorizonal className="h-4 w-4" aria-hidden="true" />
                رد
              </button>
            </form>
          </section>

          <aside className="flex flex-col gap-4">
            <section className="card p-4">
              <h2 className="text-[14px] font-extrabold text-[var(--text-primary)]">بيانات المريض</h2>
              <dl className="mt-2 space-y-1.5 text-[13px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-[var(--text-muted)]">الاسم</dt>
                  <dd className="font-bold text-[var(--text-primary)]">
                    {ticket.patient_profile.name || "غير محدّد"}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[var(--text-muted)]">البريد/الموبايل</dt>
                  <dd className="break-all font-bold text-[var(--text-primary)]" dir="ltr">
                    {ticket.patient_profile.identifier}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="card p-4">
              <h2 className="text-[14px] font-extrabold text-[var(--text-primary)]">
                المرفقات ({ticket.attachments.length})
              </h2>
              <div className="mt-2 flex flex-col gap-2">
                {ticket.attachments.length === 0 && (
                  <p className="text-[13px] text-[var(--text-muted)]">لا مرفقات.</p>
                )}
                {ticket.attachments.map((a, i) =>
                  a.type === "image" ? (
                    <a key={`${a.name}-${i}`} href={a.url} target="_blank" rel="noreferrer" className="rounded-lg border border-[var(--border)] p-2">
                      <img
                        src={a.url}
                        alt={a.name}
                        className="max-h-40 w-full rounded object-cover"
                      />
                      <span className="mt-1 block truncate text-[12px] font-bold text-[var(--text-secondary)]">
                        {a.name}
                      </span>
                    </a>
                  ) : (
                    <a
                      key={`${a.name}-${i}`}
                      href={a.url}
                      download={a.name}
                      className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[13px] font-bold text-[var(--text-secondary)]"
                    >
                      📄 {a.name}
                    </a>
                  )
                )}
              </div>
            </section>

            <section className="assist-hint card p-4">
              <h2 className="flex items-center gap-2 text-[14px] font-extrabold text-[var(--text-primary)]">
                <Lock className="h-4 w-4 text-[var(--status-warning)]" aria-hidden="true" />
                نتيجة المحرك الآلي
              </h2>
              <p className="mt-2 flex items-start gap-1.5 text-[12px] font-bold leading-relaxed text-[var(--status-warning)]">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                نتيجة آلية أولية — راجعها قبل اعتمادها في ردّك. لا تُعرض للمريض أبدًا.
              </p>
              {ticket.assistive_engine_output.raw_result ? (
                <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-[var(--surface-raised)] p-3 text-[12px] text-[var(--text-secondary)]" dir="ltr">
                  {ticket.assistive_engine_output.raw_result}
                </pre>
              ) : (
                <p className="mt-3 text-[13px] text-[var(--text-muted)]">
                  {ticket.assistive_engine_output.source === "none"
                    ? "لا يستخدم محركًا آليًا لهذا النوع من الخدمات."
                    : "لم يُولَّد مخرَج آلي لهذا الطلب (المحرك تجريبي)."}
                </p>
              )}
              <p className="mt-2 text-[11px] text-[var(--text-muted)]">
                المصدر: {ticket.assistive_engine_output.source} •{" "}
                ظاهر للمريض: {ticket.assistive_engine_output.visible_to_patient ? "نعم" : "لا (مضمون)"}
              </p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}