"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HeartHandshake, Menu, X } from "lucide-react";
import { LogoGlyph } from "./icons";
import { CONTACT, PATIENT_SITE_URL, SITE } from "@/lib/site";
import { logout, usePortal } from "@/lib/portal-store";

const NAV_LINKS = [
  { href: "#top", label: "الرئيسية" },
  { href: "/categories", label: "التصنيفات" },
  { href: "/about", label: "عن روشتة" },
  { href: "/contact", label: "تواصل" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { ready, user, doctorPendingTotal } = usePortal();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      panel
        ? Array.from(
            panel.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
          )
        : [];

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const first = focusables()[0];
    first?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <nav className={`site-nav no-print ${scrolled ? "scrolled" : ""}`}>
      <div className="site-nav-inner">
        <Link href="/" className="site-logo" aria-label={SITE.name}>
          <span className="site-logo-chip">
            <LogoGlyph className="h-5 w-5" />
          </span>
          {SITE.name}
        </Link>
        <div className="site-nav-links">
          {NAV_LINKS.map((l) =>
            l.href.startsWith("/") ? (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ) : (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            )
          )}
        </div>
        <span className="nav-spacer" />
        <div className="site-nav-actions">
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
        <a
          className="nav-cta nav-consult"
          href={PATIENT_SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <HeartHandshake className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          استشارة
        </a>
        <button
          type="button"
          className="nav-burger"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        id="site-menu"
        ref={panelRef}
        className={`nav-drawer ${open ? "open" : ""}`}
      >
        <nav className="nav-drawer-links" aria-label="التنقل الرئيسي">
          {NAV_LINKS.map((l) =>
            l.href.startsWith("/") ? (
              <Link key={l.href} href={l.href} onClick={close}>
                {l.label}
              </Link>
            ) : (
              <a key={l.href} href={l.href} onClick={close}>
                {l.label}
              </a>
            )
          )}
        </nav>
        <a
          className="nav-drawer-cta"
          href={PATIENT_SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={close}
        >
          <HeartHandshake className="h-4 w-4" aria-hidden="true" />
          الحصول على استشارة طبية
        </a>
        <div className="nav-drawer-actions">
          {ready && user?.role === "doctor" && (
            <>
              <Link className="nav-cta" href="/doctor/categories" onClick={close}>
                التصنيفات
              </Link>
              <Link className="nav-cta nav-cta-inbox" href="/doctor/inbox" onClick={close}>
                طلبات المرضى
                {doctorPendingTotal > 0 && (
                  <span className="pending-badge">{doctorPendingTotal}</span>
                )}
              </Link>
              <button
                type="button"
                className="nav-cta nav-cta-outline"
                onClick={() => {
                  close();
                  logout();
                }}
              >
                خروج
              </button>
            </>
          )}
          {ready && user?.role === "patient" && (
            <>
              <Link className="nav-cta" href="/patient" onClick={close}>
                خدمات
              </Link>
              <Link className="nav-cta nav-cta-inbox" href="/patient/tickets" onClick={close}>
                تذاكري
              </Link>
              <button
                type="button"
                className="nav-cta nav-cta-outline"
                onClick={() => {
                  close();
                  logout();
                }}
              >
                خروج
              </button>
            </>
          )}
          {(!ready || !user) && (
            <Link className="nav-cta" href="/login" onClick={close}>
              تسجيل الدخول
            </Link>
          )}
          <a className="nav-cta" href={CONTACT.mailtoSubmit} onClick={close}>
            أضف حالة
          </a>
        </div>
      </div>

      {open && (
        <button
          type="button"
          className="nav-drawer-backdrop"
          aria-label="إغلاق القائمة"
          onClick={close}
        />
      )}
    </nav>
  );
}
