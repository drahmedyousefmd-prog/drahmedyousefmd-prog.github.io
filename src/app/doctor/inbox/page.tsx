import type { Metadata } from "next";
import { RequireRole } from "@/components/portal/RequireRole";
import { DoctorInboxApp } from "@/components/doctor/DoctorInboxApp";

export const metadata: Metadata = {
  title: "طلبات المرضى — Rochetta",
  robots: { index: false },
  alternates: { canonical: "/doctor/inbox" },
};

export default function InboxPage() {
  return (
    <RequireRole role="doctor">
      <DoctorInboxApp />
    </RequireRole>
  );
}