import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { SITE, CONTACT, DOCTOR, PATIENT_SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "عن روشتة",
  description:
    "تعرّف على روشتة (Rochetta): دليل مرجعي للأطباء في مصر يغطي أحدث الروشتات والأصناف الدوائية — الجرعات، البدائل، التداخلات الدوائية والأسعار.",
  alternates: { canonical: "/about" },
};

/**
 * NOTE (owner): the paragraphs marked «يُستكمل» are placeholders. Replace them
 * with the final approved Arabic copy (qualification, references, price source,
 * last-review date). Do not publish unverified claims.
 */
export default function AboutPage() {
  return (
    <PageShell>
      <h1 className="section-heading">عن روشتة</h1>

      <div className="mt-6 space-y-8 text-[15px] leading-relaxed text-[var(--text-secondary)]">
        <section>
          <h2 className="mb-2 text-[18px] font-extrabold text-[var(--text-primary)]">
            ما هو روشتة؟
          </h2>
          <p>
            {SITE.name} ({SITE.nameAr}) دليل مرجعي للأطباء في مصر يغطي أحدث
            الروشتات والأصناف الدوائية: الجرعات، البدائل، التداخلات الدوائية
            والأسعار. موجّه للطبيب المعالج كأداة سريعة عند كتابة الروشتة.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-[18px] font-extrabold text-[var(--text-primary)]">
            الطبيب المسؤول
          </h2>
          <p>
            {DOCTOR.name} — المشرف على المحتوى الطبي في {SITE.name}.
          </p>
          <p className="mt-2 text-[13px] text-[var(--text-muted)]">
            يُستكمل: الدرجة العلمية والتخصص.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-[18px] font-extrabold text-[var(--text-primary)]">
            المراجع المعتمدة
          </h2>
          <p className="text-[13px] text-[var(--text-muted)]">
            يُستكمل: قائمة المراجع المعتمدة (مثل ABCD Drugs وغيرها).
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-[18px] font-extrabold text-[var(--text-primary)]">
            مصدر الأسعار وآخر تحديث
          </h2>
          <p className="text-[13px] text-[var(--text-muted)]">
            يُستكمل: مصدر بيانات الأسعار وتاريخ آخر تحديث.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-[18px] font-extrabold text-[var(--text-primary)]">
            إخلاء المسؤولية
          </h2>
          <p>
            المحتوى موجّه للأطباء وليس للمرضى، ولا يُغني عن القرار الطبي
            والتقييم الإكلينيكي لكل حالة على حِدة.
          </p>
          <p className="mt-2 text-[13px] text-[var(--text-muted)]">
            آخر مراجعة: يُستكمل (التاريخ).
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-[18px] font-extrabold text-[var(--text-primary)]">
            تواصل معنا
          </h2>
          <p>
            للاستفسارات والمساهمة:{" "}
            <a className="font-bold text-[var(--accent)]" href={CONTACT.gmailCompose}>
              {CONTACT.email}
            </a>
            {" · "}
            <a className="font-bold text-[var(--accent)]" href={PATIENT_SITE_URL}>
              بوابة استشارة للمرضى
            </a>
          </p>
        </section>
      </div>
    </PageShell>
  );
}
