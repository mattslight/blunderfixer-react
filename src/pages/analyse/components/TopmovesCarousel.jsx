// src/pages/analyse/components/TopmoveCarousel
import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

export default function TopmovesCarousel({ lines, onSlideChange }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  // only real lines
  const activeLines = useMemo(
    () => lines.filter((l) => l.moves.length > 0),
    [lines]
  );

  // cache the previous best‐move line
  const [prevBest, setPrevBest] = useState(null);
  useEffect(() => {
    if (activeLines.length > 0) {
      setPrevBest(activeLines[0]);
    }
  }, [activeLines]);

  // rebuild swiper nav when slides change
  useEffect(() => {
    const s = swiperRef.current;
    if (s && prevRef.current && nextRef.current) {
      s.params.navigation.prevEl = prevRef.current;
      s.params.navigation.nextEl = nextRef.current;
      s.navigation.destroy();
      s.navigation.init();
      s.navigation.update();
    }
  }, [activeLines]);

  // decide what to render
  const slidesToShow =
    activeLines.length > 0 ? activeLines : prevBest ? [prevBest] : [];

  return (
    <div className="relative mt-4 w-full">
      <Swiper
        modules={[Navigation]}
        onSwiper={(s) => (swiperRef.current = s)}
        navigation={{
          prevEl: slidesToShow.length > 1 ? prevRef.current : null,
          nextEl: slidesToShow.length > 1 ? nextRef.current : null,
        }}
        loop={false}
        allowTouchMove={true}
        spaceBetween={20}
        slidesPerView={1}
        onSlideChange={(s) => onSlideChange?.(s.activeIndex)}
        className="rounded-lg"
      >
        {slidesToShow.map((line, i) => {
          const san = line.moves[0];
          const evalText =
            line.scoreCP != null
              ? (line.scoreCP / 100).toFixed(2)
              : `#${line.mateIn}`;
          const preview = line.moves.slice(0, 7).join(' → ');

          return (
            <SwiperSlide key={i}>
              <div className="flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                <span
                  className={`mb-2 rounded-full px-3 py-1 text-sm font-bold ${
                    i === 0
                      ? 'bg-green-500 text-white' // real best
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {i === 0 ? 'Best Move' : `Alternative ${i}`}
                </span>
                <p className="mb-1 text-lg font-semibold">Move: {san}</p>
                <p className="mb-2 text-sm">Eval: {evalText}</p>
                <p className="text-center text-xs text-gray-700 dark:text-gray-300">
                  {preview}
                  {line.moves.length > 7 ? ' …' : ''}
                </p>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {slidesToShow.length > 1 && (
        <>
          <div
            ref={prevRef}
            className="absolute top-1/2 left-2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/70 p-1 shadow dark:bg-gray-700/70"
          >
            {/* left arrow SVG */}
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-black dark:text-white"
            >
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
          <div
            ref={nextRef}
            className="absolute top-1/2 right-2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/70 p-1 shadow dark:bg-gray-700/70"
          >
            {/* right arrow SVG */}
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-black dark:text-white"
            >
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}
