import type { Metadata } from "next";
import { RedirectToConsult } from "@/components/RedirectToConsult";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <RedirectToConsult path="/login" />;
}
