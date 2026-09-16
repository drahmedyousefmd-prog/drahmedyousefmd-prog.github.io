import type { Metadata } from "next";
import { RequireRole } from "@/components/portal/RequireRole";
import { DoctorLanding } from "@/components/doctor/DoctorLanding";

export const metadata: Metadata = {
  robots: { index: false },
  alternates: { canonical: "/doctor" },
};

export default function DoctorHomePage() {
  return (
    <RequireRole role="doctor">
      <DoctorLanding />
    </RequireRole>
  );
}