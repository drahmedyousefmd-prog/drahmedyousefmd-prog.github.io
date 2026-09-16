"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Stethoscope, UserRound } from "lucide-react";
import { LogoGlyph } from "../icons";
import {
  DOCTOR_IDENTIFIER,
  DOCTOR_PASSWORD,
  guestTicketCount,
  login,
  signup,
} from "@/lib/portal-store";
import { SafetyBanner } from "../portal/SafetyBanner";

export function PortalLogin() {
  const router = useRouter();
  const [patientTab, setPatientTab] = useState<"login" | "signup">("signup");
  const [error, setError] = useState<string | null>(null);
  const [guestCount] = useState(() => guestTicketCount());

  const [doctorPass, setDoctorPass] = useState("");
  const [patIdentifier, setPatIdentifier] = useState("");
  const [patName, setPatName] = useState("");
  const [patPass, setPatPass] = useState("");

  const submitPatient = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (patientTab === "signup") {
      const r = signup(patIdentifier, patPass, patName);
      if (!r.ok) return setError(r.error ?? "تعذّر التسجيل");
    } else {
      const r = login(patIdentifier, patPass);
      if (!r.ok) return setError(r.error ?? "تعذّر تسجيل الدخول");
    }
    router.push("/patient");
  };

  const submitDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const r = login(DOCTOR_IDENTIFIER, doctorPass);
    if (!r.ok) return setError(r.error ?? "تعذّر الدخول");
    if (r.role === "doctor") router.push("/doctor/categories");
  };

  const inputCls =
    "w-full rounded-[var(--radius-input)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none";

  return (
    <div className="min-h-dvh" id="top">
      <header className="portal-topbar no-print">
        <a href="/" className="site-logo" aria-label={`Rochetta — الرئيسية`}>
          <span className="site-logo-chip">
            <LogoGlyph className="h-5 w-5" />
          </span>
          Rochetta
        </a>
        <nav className="portal-topbar-links">
          <Link href="/" className="portal-topbar-link">
            العودة للرئيسية
          </Link>
        </nav>
      </header>

      <SafetyBanner />

      <main className="mx-auto flex w-full max-w-[880px] flex-col items-center px-4 pb-16 pt-10 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="hero-title" style={{ fontSize: "30px" }}>
            <span>اختر بوابتك</span>
          </h1>
          <p className="mt-2 text-[15px] text-[var(--text-secondary)]">
            سجّل دخولك بالدور المناسب — الطبيب لحسابه الخاص، والمريض لحسابه.
          </p>
        </div>

        {error && (
          <p className="mb-4 w-full rounded-xl border border-[color-mix(in srgb,var(--status-danger)_35%,transparent)] bg-[color-mix(in srgb,var(--status-danger)_8%,transparent)] px-4 py-2.5 text-[14px] font-bold text-[var(--status-danger)]">
            {error}
          </p>
        )}

        <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Doctor */}
          <section className="card p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="cat-icon" style={{ background: "var(--brand-tint)" }}>
                <Stethoscope className="h-6 w-6 text-[var(--brand)]" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-[18px] font-extrabold text-[var(--text-primary)]">
                  بوابة الطبيب
                </h2>
                <p className="text-[13px] text-[var(--text-secondary)]">
                  الدليل + طلبات المرضى
                </p>
              </div>
            </div>
            <form onSubmit={submitDoctor} className="flex flex-col gap-3">
              <input
                className={inputCls}
                value="dr.ahmed.yousef.md@gmail.com"
                readOnly
                aria-label="بريد الطبيب"
              />
              <input
                className={inputCls}
                type="password"
                placeholder="كلمة المرور"
                value={doctorPass}
                onChange={(e) => setDoctorPass(e.target.value)}
                aria-label="كلمة مرور الطبيب"
              />
              <button type="submit" className="btn-pill primary">
                دخول الطبيب
              </button>
              <p className="text-[12px] text-[var(--text-muted)]">
                حساب واحد ثابت — كلمة مرور تجريبية: <b dir="ltr">{DOCTOR_PASSWORD}</b>
              </p>
            </form>
          </section>

          {/* Patient */}
          <section className="card p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="cat-icon" style={{ background: "var(--brand-tint)" }}>
                <UserRound className="h-6 w-6 text-[var(--brand)]" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-[18px] font-extrabold text-[var(--text-primary)]">
                  بوابة المريض
                </h2>
                <p className="text-[13px] text-[var(--text-secondary)]">
                  خدمات + طلبات وشات
                </p>
              </div>
            </div>

            <div className="mb-4 flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-1" role="tablist">
              <button
                type="button"
                className={`flex-1 rounded-full px-3 py-1.5 text-[13px] font-bold transition ${patientTab === "signup" ? "bg-[var(--accent)] text-white" : "text-[var(--text-secondary)]"}`}
                onClick={() => setPatientTab("signup")}
              >
                حساب جديد
              </button>
              <button
                type="button"
                className={`flex-1 rounded-full px-3 py-1.5 text-[13px] font-bold transition ${patientTab === "login" ? "bg-[var(--accent)] text-white" : "text-[var(--text-secondary)]"}`}
                onClick={() => setPatientTab("login")}
              >
                تسجيل الدخول
              </button>
            </div>

            <form onSubmit={submitPatient} className="flex flex-col gap-3">
              {patientTab === "signup" && (
                <input
                  className={inputCls}
                  placeholder="الاسم (اختياري)"
                  value={patName}
                  onChange={(e) => setPatName(e.target.value)}
                  aria-label="اسم المريض"
                />
              )}
              <input
                className={inputCls}
                dir="ltr"
                placeholder={patientTab === "signup" ? "بريد إلكتروني أو رقم موبايل" : "بريد إلكتروني أو رقم موبايل"}
                value={patIdentifier}
                onChange={(e) => setPatIdentifier(e.target.value)}
                aria-label="بريد أو موبايل المريض"
              />
              <input
                className={inputCls}
                type="password"
                placeholder="كلمة المرور"
                value={patPass}
                onChange={(e) => setPatPass(e.target.value)}
                aria-label="كلمة مرور المريض"
              />
              <button type="submit" className="btn-pill primary">
                {patientTab === "signup" ? "إنشاء الحساب والدخول" : "دخول بوابة المريض"}
              </button>
              <p className="text-[12px] text-[var(--text-muted)]">
                الحسابات محلية على هذا الجهاز (تجريبي).
              </p>
              {guestCount > 0 && (
                <p className="rounded-xl border border-[color-mix(in srgb,var(--accent)_35%,transparent)] bg-[color-mix(in srgb,var(--accent)_8%,transparent)] px-3 py-2 text-[12px] font-bold text-[var(--text-secondary)]">
                  وجدنا {guestCount} طلبًا على هذا الجهاز — سيُربط تلقائيًا بحسابك
                  لتظهر لك من أي جهاز.
                </p>
              )}
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}