"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

type HeroSwiperProps = {
  slides: string[];
};

const HeroSwiper = ({ slides }: HeroSwiperProps) => {
  return (
    <Swiper
      modules={[Autoplay, EffectFade]}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      speed={1000}
      loop
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      className="h-full w-full"
    >
      {slides.map((src, i) => (
        <SwiperSlide key={`${src}-${i}`}>
          <Image
            src={src}
            alt={`Hero slide ${i + 1}`}
            fill
            sizes="100vw"
            priority={i === 0}
            className="object-cover object-center"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroSwiper;
