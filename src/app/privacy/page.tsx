import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { SITE, CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description:
    "سياسة الخصوصية في روشتة (Rochetta): البيانات التي تُحفظ على جهازك، وكيفية استخدامها، وحقوقك.",
  alternates: { canonical: "/privacy" },
};

/**
 * NOTE (owner): draft privacy policy — review before publishing and complete
 * the «يُستكمل» items.
 */
export default function PrivacyPage() {
  return (
    <PageShell>
      <h1 className="section-heading">سياسة الخصوصية</h1>

      <div className="mt-6 space-y-8 text-[15px] leading-relaxed text-[var(--text-secondary)]">
        <section>
          <h2 className="mb-2 text-[18px] font-extrabold text-[var(--text-primary)]">
            البيانات التي نجمعها
          </h2>
          <p>
            {SITE.name} موقع مرجعي للأطباء. لا نطلب تسجيلًا لتصفح المحتوى،
            وتُحفظ تفضيلات العرض (مثل آخر ما تصفّحته) داخل متصفحك على جهازك
            فقط.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-[18px] font-extrabold text-[var(--text-primary)]">
            كيف نستخدم البيانات
          </h2>
          <p>
            تُستخدم التفضيلات المحلية لتحسين تجربة التصفح. لا نبيع بياناتك ولا
            نشاركها مع أطراف تجارية.
          </p>
          <p className="mt-2 text-[13px] text-[var(--text-muted)]">
            يُستكمل: تفاصيل أي خدمات تحليلات أو استضافة إن وُجدت.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-[18px] font-extrabold text-[var(--text-primary)]">
            الاستشارات الطبية
          </h2>
          <p>
            الاستشارات المباشرة مع الطبيب تتم على بوابة{" "}
            <a
              className="font-bold text-[var(--accent)]"
              href="https://drahmedyousefmd-prog.github.io/estesharah"
            >
              استشارة
            </a>{" "}
            ولها سياسة خصوصية خاصة بها.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-[18px] font-extrabold text-[var(--text-primary)]">
            تواصل بخصوص الخصوصية
          </h2>
          <p>
            لأي استفسار متعلّق بالخصوصية:{" "}
            <a className="font-bold text-[var(--accent)]" href={CONTACT.gmailCompose}>
              {CONTACT.email}
            </a>
            .
          </p>
          <p className="mt-2 text-[13px] text-[var(--text-muted)]">
            آخر مراجعة: يُستكمل (التاريخ).
          </p>
        </section>
      </div>
    </PageShell>
  );
}
