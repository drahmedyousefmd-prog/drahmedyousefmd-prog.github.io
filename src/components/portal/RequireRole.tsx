"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { usePortal, type SiteRole } from "@/lib/portal-store";

/**
 * Client-side role gate. Static exports can't enforce real access control, so
 * this is a demo gate: it unlocks the guarded UI only for the signed-in role
 * and redirects everyone else to /login instead of rendering protected content.
 */
export function RequireRole({
  role,
  children,
}: {
  role: SiteRole;
  children: ReactNode;
}) {
  const router = useRouter();
  const { ready, user } = usePortal();

  useEffect(() => {
    if (ready && (!user || user.role !== role)) {
      router.replace("/login");
    }
  }, [ready, user, role, router]);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-[15px] text-[var(--text-muted)]">
        جارٍ التحقق من الجلسة…
      </div>
    );
  }

  if (!user || user.role !== role) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--border)] text-[var(--text-secondary)]">
          <Lock className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-[20px] font-extrabold text-[var(--text-primary)]">
            هذه البوابة تتطلب تسجيل الدخول
          </h1>
          <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
            جارٍ تحويلك إلى تسجيل الدخول…
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}