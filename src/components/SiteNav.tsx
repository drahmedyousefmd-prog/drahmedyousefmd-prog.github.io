"use client";

import { useEffect, useState } from "react";
import { StethoscopeIcon } from "./icons";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`site-nav no-print ${scrolled ? "scrolled" : ""}`}>
      <div className="site-nav-inner">
        <a href="#top" className="site-logo">
          <span className="site-logo-chip">
            <StethoscopeIcon className="h-4.5 w-4.5" />
          </span>
          Rochetta
        </a>
        <div className="site-nav-links">
          <a href="#top">الرئيسية</a>
          <a href="#categories">التصنيفات</a>
          <a href="#contact">تواصل</a>
        </div>
        <span className="nav-spacer" />
        <a
          className="nav-cta"
          href="mailto:Dr.ahmed.yousef.md@gmail.com?subject=إضافة حالة%20طبية"
        >
          أضف حالة
        </a>
      </div>
    </nav>
  );
}