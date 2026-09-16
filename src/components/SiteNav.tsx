"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogoGlyph } from "./icons";
import { CONTACT, SITE } from "@/lib/site";
import { logout, usePortal } from "@/lib/portal-store";
import { ModeSwitch } from "./ModeSwitch";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const { ready, user, doctorPendingTotal } = usePortal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`site-nav no-print ${scrolled ? "scrolled" : ""}`}>
      <div className="site-nav-inner">
        <a href="/" className="site-logo" aria-label={SITE.name}>
          <span className="site-logo-chip">
            <LogoGlyph className="h-5 w-5" />
          </span>
          {SITE.name}
        </a>
        <div className="site-nav-links">
          <a href="#top">الرئيسية</a>
          <a href="#services" className="no-print">
            خدمات المريض
          </a>
          <a href="#categories">التصنيفات</a>
          <a href="#contact">تواصل</a>
        </div>
        <span className="nav-spacer" />
        {ready && user?.role === "doctor" && (
          <>
            <Link className="nav-cta" href="/doctor/categories">
              التصنيفات
            </Link>
            <Link className="nav-cta nav-cta-inbox" href="/doctor/inbox">
              طلبات المرضى
              {doctorPendingTotal > 0 && (
                <span className="pending-badge">{doctorPendingTotal}</span>
              )}
            </Link>
            <button
              type="button"
              className="nav-cta nav-cta-outline"
              onClick={() => logout()}
            >
              خروج
            </button>
          </>
        )}
        {ready && user?.role === "patient" && (
          <>
            <Link className="nav-cta" href="/patient">
              خدمات
            </Link>
            <Link className="nav-cta nav-cta-inbox" href="/patient/tickets">
              تذاكري
            </Link>
            <button
              type="button"
              className="nav-cta nav-cta-outline"
              onClick={() => logout()}
            >
              خروج
            </button>
          </>
        )}
        {(!ready || !user) && (
          <Link className="nav-cta" href="/login">
            تسجيل الدخول
          </Link>
        )}
        <a className="nav-cta" href={CONTACT.mailtoSubmit}>
          أضف حالة
        </a>
      </div>
      <div className="site-nav-mode">
        <ModeSwitch />
      </div>
    </nav>
  );
}