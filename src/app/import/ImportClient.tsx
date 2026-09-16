"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, CircleAlert, LoaderCircle, Inbox } from "lucide-react";
import { LogoGlyph, WhatsAppIcon } from "@/components/icons";
import { CONTACT, SITE } from "@/lib/site";
import { decodeTicketPayload, importTicket } from "@/lib/portal-store";
import { serviceLabel } from "@/lib/services";

type Status =
  | { kind: "loading" }
  | { kind: "ok"; id: string; service: string }
  | { kind: "exists"; id: string; service: string }
  | { kind: "error" };

export default function ImportClient() {
  const sp = useSearchParams();
  const [status, setStatus] = useState<Status>({ kind: "loading" });

  useEffect(() => {
    const raw = sp.get("t");
    const payload = raw ? decodeTicketPayload(raw) : null;
    if (!payload) {
      setStatus({ kind: "error" });
      return;
    }
    const res = importTicket(payload);
    const label = serviceLabel(payload.t);
    if (res === "exists") setStatus({ kind: "exists", id: payload.id, service: label });
    else setStatus({ kind: "ok", id: payload.id, service: label });
  }, [sp]);

  return (
    <div className="min-h-dvh" id="top">
      <header className="site-nav">
        <div className="site-nav-inner">
          <a href="/" className="site-logo" aria-label={SITE.name}>
            <span className="site-logo-chip">
              <LogoGlyph className="h-5 w-5" />
            </span>
            {SITE.name}
          </a>
          <a className="nav-cta" href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon className="h-4 w-4" />
            واتساب
          </a>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[560px] flex-col items-center px-4 pb-16 pt-14 text-center sm:px-6">
        {status.kind === "loading" && (
          <>
            <LoaderCircle className="mb-4 h-10 w-10 animate-spin text-[var(--accent)]" aria-hidden="true" />
            <h1 className="text-[20px] font-extrabold text-[var(--text-primary)]">
              جارٍ استيراد الطلب…
            </h1>
          </>
        )}

        {status.kind === "ok" && (
          <div className="w-full rounded-2xl border border-[color-mix(in srgb,var(--status-safe)_35%,transparent)] bg-[color-mix(in srgb,var(--status-safe)_7%,transparent)] p-6">
            <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-[var(--status-safe)]" aria-hidden="true" />
            <h1 className="text-[19px] font-extrabold text-[var(--text-primary)]">
              تم استيراد الطلب بنجاح
            </h1>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-secondary)]">
              <b>{status.service}</b> — <span dir="ltr">{status.id}</span> أصبح الآن في صندوق
              طلبات المرضى على هذا الجهاز.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/doctor/inbox" className="btn-pill primary">
                <Inbox className="h-4 w-4" aria-hidden="true" />
                فتح صندوق الطلبات
              </Link>
              <Link href="/" className="btn-pill outline">
                الصفحة الرئيسية
              </Link>
            </div>
          </div>
        )}

        {status.kind === "exists" && (
          <div className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-[var(--accent)]" aria-hidden="true" />
            <h1 className="text-[19px] font-extrabold text-[var(--text-primary)]">
              هذا الطلب مستورد بالفعل
            </h1>
            <p className="mt-2 text-[14px] text-[var(--text-secondary)]">
              <span dir="ltr">{status.id}</span> موجود مسبقًا في صندوق طلبات المرضى.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/doctor/inbox" className="btn-pill primary">
                فتح صندوق الطلبات
              </Link>
            </div>
          </div>
        )}

        {status.kind === "error" && (
          <div className="w-full rounded-2xl border border-[color-mix(in srgb,var(--status-danger)_35%,transparent)] bg-[color-mix(in srgb,var(--status-danger)_7%,transparent)] p-6">
            <CircleAlert className="mx-auto mb-3 h-10 w-10 text-[var(--status-danger)]" aria-hidden="true" />
            <h1 className="text-[19px] font-extrabold text-[var(--text-primary)]">
              رابط غير صالح
            </h1>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-secondary)]">
              هذا الرابط لا يحتوي على طلب صالح. تأكد من استخدام الرابط المرفق داخل رسالة
              الاستشارة المرسلة عبر واتساب أو البريد.
            </p>
            <Link href="/" className="btn-pill primary mt-5">
              الصفحة الرئيسية
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}