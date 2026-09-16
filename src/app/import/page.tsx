import type { Metadata } from "next";
import { Suspense } from "react";
import ImportClient from "./ImportClient";

export const metadata: Metadata = {
  title: "استيراد الطلب",
  robots: { index: false, follow: false },
};

export default function ImportPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh flex-col items-center justify-center gap-2 px-6 text-center">
          <p className="text-[15px] font-bold text-[var(--text-primary)]">جارٍ استيراد الطلب…</p>
        </div>
      }
    >
      <ImportClient />
    </Suspense>
  );
}