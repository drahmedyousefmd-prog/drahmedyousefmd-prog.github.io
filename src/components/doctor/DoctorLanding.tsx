"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePortal } from "@/lib/portal-store";

/** Doctor's landing: authenticated doctors are routed to the categories workspace. */
export function DoctorLanding() {
  const router = useRouter();
  const { ready, user } = usePortal();

  useEffect(() => {
    if (!ready) return;
    router.replace(user?.role === "doctor" ? "/doctor/categories" : "/login");
  }, [ready, user, router]);

  return (
    <div className="flex min-h-dvh items-center justify-center text-[15px] text-[var(--text-muted)]">
      جارٍ التوجيه…
    </div>
  );
}