"use client";

import Image from "next/image";
import dynamic from "next/dynamic";

const slides = [
  "/Home materials/Slider3.webp",
  "/Home materials/Slider2.webp",
  "/Home materials/Slider1.webp",
];

// Swiper uses new Date() during prerender, so it only loads in the browser.
// The first slide is shown meanwhile to avoid any flicker.
const HeroSwiper = dynamic(() => import("./HeroSwiper"), {
  ssr: false,
  loading: () => (
    <Image
      src={slides[0]}
      alt="Hero slide 1"
      fill
      sizes="100vw"
      priority
      className="object-cover object-center"
    />
  ),
});

const Slider = () => {
  return (
    <section className="relative h-[calc(100vh-5rem)] min-h-[520px] w-full overflow-hidden bg-black">
      {/* Background slider + blur/gradient overlay */}
      <div className="absolute inset-0">
        <HeroSwiper slides={slides} />
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/85 via-black/50 to-black/10 backdrop-blur-[4px]" />
      </div>

      {/* Content */}
      <div className="relative z-20 flex h-full items-center px-6 sm:px-8">
        <div className="max-w-xl">
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Always Fresh.
            <br />
            <span className="text-red-500">Always Crispy.</span>
            <br />
            Always Hot.
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
            Authentic Italian taste with an irresistible Egyptian twist, made
            fresh and delivered hot.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <button
              type="button"
              className="cursor-pointer rounded-full bg-red-600 px-9 py-4 font-semibold text-white shadow-lg shadow-red-900/40 transition hover:bg-red-700 active:scale-95"
            >
              Order Now
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-full border border-white/50 px-9 py-4 font-semibold text-white transition hover:bg-white hover:text-black active:scale-95"
            >
              View Menu
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Slider;
