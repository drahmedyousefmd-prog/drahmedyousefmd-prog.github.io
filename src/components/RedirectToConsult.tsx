"use client";

import { useEffect } from "react";
import { PATIENT_SITE_URL } from "@/lib/site";

/**
 * Static-export friendly redirect. Rochetta no longer hosts the patient
 * consultation portal — those routes now live on the separate «استشارة» site.
 * `output: "export"` forbids server redirects, so we forward on the client and
 * offer a manual link for users (or bots) with JS disabled.
 */
export function RedirectToConsult({ path = "" }: { path?: string }) {
  const target = `${PATIENT_SITE_URL}${path}`;

  useEffect(() => {
    window.location.replace(target);
  }, [target]);

  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center"
      style={{ background: "var(--bg)" }}
    >
      <span
        className="site-logo-chip"
        style={{ width: 48, height: 48 }}
        aria-hidden="true"
      />
      <p
        style={{
          fontWeight: 700,
          fontFamily: "var(--font-heading)",
          color: "var(--text-primary)",
        }}
      >
        جارٍ تحويلك إلى موقع الاستشارات الطبية…
      </p>
      <a
        href={target}
        style={{
          background: "var(--accent)",
          color: "#fff",
          padding: "10px 22px",
          borderRadius: 999,
          fontWeight: 700,
          fontFamily: "var(--font-heading)",
        }}
      >
        انتقل الآن
      </a>
    </div>
  );
}
