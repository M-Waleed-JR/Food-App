"use client";

import { Utensils, ShoppingCartIcon, User, MenuIcon, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const handleClick = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <div className="w-full bg-white shadow-sm relative z-50">
      {/* Discount Notification */}
      <div className="w-full text-center bg-red-400 text-white py-2 text-xs md:text-sm font-medium">
        <p>Get 20% off on your first order • Free delivery over $50!</p>
      </div>

      {/* Main Header Bar */}
      <div className="w-full px-4 md:px-8 py-4 flex items-center justify-between">
        {/* LOGO */}
        <a href="#" className="flex items-center gap-2 group cursor-pointer">
          <div className="p-2 bg-red-500 text-white rounded-xl shadow-md group-hover:scale-105 transition-transform duration-200">
            <Utensils className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-black tracking-tight text-gray-900 group-hover:text-red-500 transition-colors">
              GUSTO
            </span>
            <span className="text-[10px] md:text-xs font-semibold px-2 py-0.5 bg-red-50 text-red-500 rounded-full border border-red-100">
              المذاق
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:block">
          <ul className="flex gap-8 font-medium text-gray-700">
            <li className="cursor-pointer hover:text-red-500 transition-colors">
              Home
            </li>
            <li className="cursor-pointer hover:text-red-500 transition-colors">
              Menu
            </li>
            <li className="cursor-pointer hover:text-red-500 transition-colors">
              Orders
            </li>
            <li className="cursor-pointer hover:text-red-500 transition-colors">
              Contact
            </li>
          </ul>
        </div>

        {/* Right Actions & Mobile Toggle */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Action buttons (Visible on Desktop) */}
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
            <ShoppingCartIcon className="w-4 h-4" />
            Cart
          </button>

          <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg text-sm font-medium shadow-sm transition-colors">
            <User className="w-4 h-4" />
            Login
          </button>

          {/* Cart Icon Button for ultra-small mobile screens when closed */}
          <button className="sm:hidden p-2 text-gray-700 bg-gray-100 rounded-lg">
            <ShoppingCartIcon className="w-5 h-5" />
          </button>

          {/* Mobile Hamburger / Close Button */}
          <button
            onClick={handleClick}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg lg:hidden transition-colors"
            aria-label="Toggle Navigation"
          >
            {openMenu ? (
              <X className="w-6 h-6" />
            ) : (
              <MenuIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Modern Red Full-Screen Overlay Menu */}
      {openMenu && (
        <div className="lg:hidden top-[100px] left-0 w-full h-[calc(100vh-108px)] bg-red-500 flex flex-col justify-between p-8 z-50 animate-in fade-in-20 slide-in-from-top-4 duration-300">
          {/* Main Navigation Links */}
          <ul className="flex flex-col items-center justify-center gap-8 text-white font-bold text-2xl tracking-wide my-auto">
            <li
              className="cursor-pointer hover:text-red-100 hover:scale-110 transition-all duration-200"
              onClick={() => setOpenMenu(false)}
            >
              Home
            </li>
            <li
              className="cursor-pointer hover:text-red-100 hover:scale-110 transition-all duration-200"
              onClick={() => setOpenMenu(false)}
            >
              Menu
            </li>
            <li
              className="cursor-pointer hover:text-red-100 hover:scale-110 transition-all duration-200"
              onClick={() => setOpenMenu(false)}
            >
              Orders
            </li>
            <li
              className="cursor-pointer hover:text-red-100 hover:scale-110 transition-all duration-200"
              onClick={() => setOpenMenu(false)}
            >
              Contact
            </li>
          </ul>

          {/* Bottom Action Cards for Mobile */}
          <div className="flex flex-col gap-3 w-full max-w-xs mx-auto pb-6">
            <button
              onClick={() => setOpenMenu(false)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white text-red-500 font-semibold rounded-xl shadow-md active:scale-95 transition-transform"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              View Cart
            </button>
            <button
              onClick={() => setOpenMenu(false)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 text-white font-semibold rounded-xl border border-red-300 shadow-md active:scale-95 transition-transform"
            >
              <User className="w-5 h-5" />
              Login / Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
