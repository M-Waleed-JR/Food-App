"use client";

import Image from "next/image";
import dynamic from "next/dynamic";

const slides = [
  "/Home materials/Pasta.webp",
  "/Home materials/Pizza.webp",
  "/Home materials/Burger.webp",
  "/Home materials/FriedChicken.webp",
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
    <section
      id="home"
      className="relative h-svh min-h-[560px] w-full overflow-hidden bg-black"
    >
      {/* Background slider + blur/gradient overlay */}
      <div className="absolute inset-0">
        <HeroSwiper slides={slides} />

        {/* Base blur: always visible, uniform over the whole image */}
        <div className="pointer-events-none absolute inset-0 z-10 backdrop-blur-[5px]" />

        {/* Extra blur that fades out: stronger behind the text, lighter elsewhere */}
        <div className="pointer-events-none absolute inset-0 z-10 backdrop-blur-[10px] [mask-image:linear-gradient(to_top,black_25%,transparent_75%)] md:[mask-image:linear-gradient(to_right,black_20%,transparent_80%)]" />

        {/* Smooth gradient: bottom on mobile, left on desktop */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent md:bg-gradient-to-r md:from-black/85 md:via-black/45 md:to-transparent" />
      </div>

      {/* Content: bottom on mobile, centered on desktop */}
      <div className="relative z-20 flex h-full items-end px-5 pb-10 sm:px-8 md:items-center md:pb-0">
        <div className="w-full max-w-xl">
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Always Fresh.
            <br />
            <span className="text-red-500">Always Crispy.</span>
            <br />
            Always Hot.
          </h1>

          <p className="mt-3 max-w-md text-base leading-relaxed text-white/80 md:mt-6 md:text-lg">
            Authentic Italian taste • with an Egyptian twist
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-9 sm:flex sm:gap-4">
            <button
              type="button"
              className="cursor-pointer rounded-full bg-red-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-900/40 transition hover:bg-red-700 active:scale-95 sm:px-9 sm:py-4 sm:text-base"
            >
              Order Now
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-full border border-white/50 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-black active:scale-95 sm:px-9 sm:py-4 sm:text-base"
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
