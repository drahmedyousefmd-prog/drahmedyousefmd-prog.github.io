import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { SITE, CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "تواصل",
  description:
    "تواصل مع فريق روشتة (Rochetta): البريد الإلكتروني وواتساب لإضافة حالة أو الاستفسار عن محتوى دليل الروشتات.",
  alternates: { canonical: "/contact" },
};

/** Placeholder — the owner will provide the final Arabic copy. */
export default function ContactPage() {
  return (
    <PageShell>
      <h1 className="section-heading">تواصل معنا</h1>

      <div className="mt-6 space-y-6 text-[15px] leading-relaxed text-[var(--text-secondary)]">
        <p>
          نرحّب باقتراحاتك وإضافاتك على {SITE.name}. تواصل معنا عبر:
        </p>
        <ul className="space-y-2">
          <li>
            البريد الإلكتروني:{" "}
            <a className="font-bold text-[var(--accent)]" href={CONTACT.gmailCompose}>
              {CONTACT.email}
            </a>
          </li>
          <li>
            واتساب:{" "}
            <a
              className="font-bold text-[var(--accent)]"
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              {CONTACT.phoneDisplay}
            </a>
          </li>
          <li>
            LinkedIn:{" "}
            <a
              className="font-bold text-[var(--accent)]"
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              {CONTACT.creatorName}
            </a>
          </li>
        </ul>
        <p className="text-[13px] text-[var(--text-muted)]">
          يُستكمل: ساعات العمل ونموذج التواصل (إن وُجد).
        </p>
      </div>
    </PageShell>
  );
}
