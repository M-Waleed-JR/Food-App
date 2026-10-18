"use client";

import { Utensils, Menu, X, Heart, HandPlatter } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const links = [
  { href: "/#home", label: "Home" },
  { href: "/#AboutUs", label: "AboutUs" },
  { href: "/#Menu", label: "Menu" },
  { href: "/#OurStaff", label: "OurStaff" },
  { href: "/Contact", label: "Contact" },
];

const sectionIds = ["home", "AboutUs", "Menu", "OurStaff"];

// Custom smooth scroll: works on every device regardless of OS animation settings
const smoothScrollTo = (targetY: number, duration = 750) => {
  const startY = window.scrollY;
  const diff = targetY - startY;
  if (Math.abs(diff) < 2) return;
  const startTime = performance.now();

  let cancelled = false;
  const cancel = () => {
    cancelled = true;
    window.removeEventListener("wheel", cancel);
    window.removeEventListener("touchstart", cancel);
  };
  window.addEventListener("wheel", cancel, { passive: true });
  window.addEventListener("touchstart", cancel, { passive: true });

  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const step = (now: number) => {
    if (cancelled) return;
    const progress = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, startY + diff * ease(progress));
    if (progress < 1) requestAnimationFrame(step);
    else cancel();
  };
  requestAnimationFrame(step);
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();
  const solid = scrolled || open;

  // Navbar background on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll spy
  useEffect(() => {
    if (pathname !== "/") return;

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && setActiveSection(e.target.id),
        ),
      { rootMargin: "-40% 0px -55% 0px" },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  const isLinkActive = (href: string) => {
    if (href === "/Contact") return pathname === "/Contact";
    if (pathname === "/") return activeSection === href.replace("/#", "");
    return false;
  };

  // Only intercept in-page links when we're already on the home page
  const handleClick = (e: React.MouseEvent, href: string) => {
    if (pathname !== "/" || !(href === "/" || href.startsWith("/#"))) return;

    e.preventDefault();
    const id = href.replace("/#", "").replace("/", "") || "home";
    const el = document.getElementById(id);

    smoothScrollTo(
      id === "home" || !el
        ? 0
        : el.getBoundingClientRect().top + window.scrollY - 80,
    );
    window.history.pushState(null, "", id === "home" ? "/" : `#${id}`);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Promo bar */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ${
          scrolled ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="bg-black/50 py-2 text-center text-xs text-white/80 backdrop-blur-md md:text-sm">
            Get <span className="font-semibold text-red-400">20% off</span> on
            your first order
          </p>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={`transition-colors duration-300 ${
          solid
            ? "bg-neutral-950/90 shadow-[0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
            : "bg-gradient-to-b from-black/50 to-transparent"
        }`}
      >
        <nav className="relative flex h-16 items-center justify-between px-5 sm:px-8">
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => handleClick(e, "/")}
            className="group flex items-center gap-1.5"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-red-600 text-white shadow-lg shadow-red-900/40 transition-transform group-hover:scale-105">
              <Utensils className="h-[18px] w-[18px]" />
            </span>
            <span className="text-xl font-black italic tracking-tight text-white md:text-2xl">
              GUSTO
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-red-600 md:text-xs">
              المذاق
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-9 lg:absolute lg:left-1/2 lg:flex lg:-translate-x-1/2">
            {links.map(({ href, label }) => {
              const active = isLinkActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={(e) => handleClick(e, href)}
                    className={`relative py-1 text-sm font-medium transition-colors ${
                      active ? "text-white" : "text-white/70 hover:text-white"
                    }`}
                  >
                    {label}
                    {active && (
                      <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-red-500" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/book-a-table"
              className="hidden cursor-pointer items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-900/40 transition hover:bg-red-700 active:scale-95 sm:inline-flex"
            >
              <HandPlatter className="h-4 w-4" />
              Book a table
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation"
              aria-expanded={open}
              className="grid h-10 w-10 cursor-pointer place-items-center rounded-full text-white transition hover:bg-white/10 lg:hidden"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="absolute inset-x-0 top-full border-t border-white/10 bg-neutral-950 px-5 pb-6 pt-2 shadow-2xl lg:hidden">
          <ul>
            {links.map(({ href, label }) => {
              const active = isLinkActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={(e) => {
                      handleClick(e, href);
                      setOpen(false);
                    }}
                    className={`flex items-center justify-between border-b border-white/10 py-4 text-lg font-semibold transition-colors ${
                      active ? "text-red-500" : "text-white hover:text-red-400"
                    }`}
                  >
                    {label}
                    {active && (
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href="/book-a-table"
            onClick={() => setOpen(false)}
            className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-red-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-900/40 transition active:scale-95"
          >
            <HandPlatter className="h-4 w-4" />
            Book a table
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
