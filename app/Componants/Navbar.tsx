"use client";

import { Utensils, User, Menu, X, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useSyncExternalStore } from "react";

const links = [
  { href: "#home", label: "Home" },
  { href: "#AboutUs", label: "AboutUs" },
  { href: "#Menu", label: "Menu" },
  { href: "#WishList", label: "WishList" },
  { href: "#Contact", label: "Contact" },
];

// True once the page is scrolled a little. useSyncExternalStore keeps this
// lint-safe (no setState inside an effect) and hydration-safe (server = false).
const subscribe = (callback: () => void) => {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
};
const useScrolled = () =>
  useSyncExternalStore(
    subscribe,
    () => window.scrollY > 20,
    () => false,
  );

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const scrolled = useScrolled();
  const pathname = usePathname();
  const solid = scrolled || open;

  useEffect(() => {
    const handleScrollSpy = () => {
      const sectionIds = ["home", "AboutUs", "Menu", "WishList", "Contact"];
      const scrollPosition = window.scrollY + 120;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(id);
          return;
        }
      }
      setActiveSection("home");
    };

    handleScrollSpy();
    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, []);

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (pathname !== "/") return;

    e.preventDefault();
    const targetId = href.replace(/^(\/)?#/, "") || "home";

    if (targetId === "home") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      window.history.pushState(null, "", "/");
      setActiveSection("home");
      return;
    }

    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      window.history.pushState(null, "", `#${targetId}`);
      setActiveSection(targetId);
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Promo bar: collapses smoothly once you scroll */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ${
          scrolled ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="bg-black/50 py-2 text-center text-xs text-white/80 backdrop-blur-md md:text-sm">
            Get <span className="font-semibold text-red-400">20% off</span> on
            your first order • Free delivery over $50
          </p>
        </div>
      </div>

      {/* Main bar: transparent over the hero, solid once you scroll */}
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
            onClick={(e) => handleScroll(e, "/")}
            className="group flex items-center gap-1.5"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-red-600 text-white shadow-lg shadow-red-900/40 transition-transform group-hover:scale-105">
              <Utensils className="h-[18px] w-[18px]" />
            </span>
            <span className="text-xl font-black tracking-tight text-white md:text-2xl italic cursor-pointer">
              GUSTO
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-red-600 md:text-xs">
              المذاق
            </span>
          </Link>

          {/* Desktop links (centered) */}
          <ul className="hidden items-center gap-9 lg:absolute lg:left-1/2 lg:flex lg:-translate-x-1/2">
            {links.map(({ href, label }) => {
              const targetId = href.replace(/^(\/)?#/, "") || "home";
              const active = activeSection === targetId;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={(e) => handleScroll(e, href)}
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
            <button
              type="button"
              aria-label="Cart"
              className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-white/20 text-white/90 transition hover:bg-white/10"
            >
              <Heart className="h-[18px] w-[18px]" />
            </button>

            <button
              type="button"
              className="hidden cursor-pointer items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-900/40 transition hover:bg-red-700 active:scale-95 sm:inline-flex"
            >
              <User className="h-4 w-4" />
              Login
            </button>

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
              const targetId = href.replace(/^(\/)?#/, "") || "home";
              const active = activeSection === targetId;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={(e) => {
                      handleScroll(e, href);
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

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-red-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-900/40 transition active:scale-95"
          >
            <User className="h-4 w-4" />
            Login / Sign Up
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
