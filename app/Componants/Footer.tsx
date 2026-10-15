"use client";

import { Utensils, Phone, Mail, MapPin, Clock } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer
      id="Contact"
      className="w-full bg-[#05070b] text-gray-300 pt-12 pb-6 border-t border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Brand Info */}
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 group cursor-pointer w-max"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-red-600 text-white shadow-lg shadow-red-900/40 transition-transform group-hover:scale-105">
              <Utensils className="h-[18px] w-[18px]" />
            </span>
            <span className="text-xl font-black tracking-tight text-white md:text-2xl italic">
              GUSTO
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-red-600 md:text-xs">
              المذاق
            </span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed">
            Delivering authentic flavors and memorable dining experiences
            straight to your doorstep. Fresh ingredients, cooked with love.
          </p>

          {/* Social Icons (Inline SVGs) */}
          <div className="flex items-center gap-3 mt-2">
            {/* Facebook */}
            <a
              href="#"
              className="p-2 bg-gray-800 hover:bg-red-500 hover:text-white rounded-lg transition-colors text-gray-300"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            {/* Instagram */}
            <a
              href="#"
              className="p-2 bg-gray-800 hover:bg-red-500 hover:text-white rounded-lg transition-colors text-gray-300"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            {/* Twitter / X */}
            <a
              href="#"
              className="p-2 bg-gray-800 hover:bg-red-500 hover:text-white rounded-lg transition-colors text-gray-300"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4 border-b border-red-500/40 pb-2 w-max">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link
                href="#home"
                className="hover:text-red-400 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="#AboutUs"
                className="hover:text-red-400 transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="#Menu"
                className="hover:text-red-400 transition-colors"
              >
                Menu
              </Link>
            </li>
            <li>
              <Link
                href="#OurStaff"
                className="hover:text-red-400 transition-colors"
              >
                Our Staff
              </Link>
            </li>
            <li>
              <Link
                href="#Contact"
                className="hover:text-red-400 transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Opening Hours */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4 border-b border-red-500/40 pb-2 w-max">
            Opening Hours
          </h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-white">Mon - Fri:</p>
                <p className="text-gray-400 text-xs">10:00 AM – 11:00 PM</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-white">Sat - Sun:</p>
                <p className="text-gray-400 text-xs">11:00 AM – 12:00 AM</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4 border-b border-red-500/40 pb-2 w-max">
            Get in Touch
          </h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-red-400 shrink-0" />
              <span className="text-xs text-gray-300">
                123 Culinary Street, Food District
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-red-400 shrink-0" />
              <span className="text-xs text-gray-300">+1 (555) 234-5678</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-red-400 shrink-0" />
              <span className="text-xs text-gray-300">support@gusto.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-6 border-t border-gray-800 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>
          2026 © <span className="text-gray-300 font-semibold">Gusto</span>. All
          Rights Reserved.
        </p>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-gray-400 transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-gray-400 transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
