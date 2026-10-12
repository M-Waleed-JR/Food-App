"use client";

import { Utensils, ShoppingCart, User, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/orders", label: "Orders" },
  { href: "/contact", label: "Contact" },
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
  const scrolled = useScrolled();
  const pathname = usePathname();
  const solid = scrolled || open;

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
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-red-600 text-white shadow-lg shadow-red-900/40 transition-transform group-hover:scale-105">
              <Utensils className="h-[18px] w-[18px]" />
            </span>
            <span className="text-xl font-black tracking-tight text-white md:text-2xl">
              GUSTO
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-white/70 md:text-xs">
              المذاق
            </span>
          </Link>

          {/* Desktop links (centered) */}
          <ul className="hidden items-center gap-9 lg:absolute lg:left-1/2 lg:flex lg:-translate-x-1/2">
            {links.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
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
              <ShoppingCart className="h-[18px] w-[18px]" />
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
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
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
