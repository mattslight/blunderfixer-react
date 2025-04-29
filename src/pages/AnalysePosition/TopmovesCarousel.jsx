import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { useRef, useMemo, useEffect } from "react";
import { Chess } from "chess.js";

export default function TopmovesCarousel({ result, onSlideChange }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  // build SAN moves
  const chess = useMemo(() => new Chess(result.fen), [result.fen]);
  const moves = useMemo(() => {
    return result.top_moves.map((m) => {
      const uci = m.move;
      const from = uci.slice(0, 2);
      const to = uci.slice(2, 4);
      const promo = uci.length === 5 ? uci[4] : undefined;
      const moveObj = chess.move({ from, to, promotion: promo });
      const san = moveObj?.san || uci;
      chess.undo();
      return { ...m, san };
    });
  }, [result.top_moves, chess]);

  // once refs and swiper instance exist, re-bind navigation
  useEffect(() => {
    const swiper = swiperRef.current;
    if (swiper && prevRef.current && nextRef.current) {
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
      // re-init navigation so clicks attach
      swiper.navigation.destroy();
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, [moves]);

  return (
    <div className="relative mt-4 w-full">
      <Swiper
        modules={[Navigation]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        spaceBetween={20}
        slidesPerView={1}
        onSlideChange={(s) => onSlideChange?.(s.activeIndex)}
        className="rounded-lg"
      >
        {moves.map((m, i) => (
          <SwiperSlide key={i}>
            <div className="flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <span
                className={`mb-2 rounded-full px-3 py-1 text-sm font-bold ${
                  i === 0 ? "bg-green-500 text-white" : "bg-blue-500 text-white"
                }`}
              >
                {i === 0 ? "Best Move" : `Alternative ${i}`}
              </span>
              <p className="mb-1 text-lg font-semibold">Move: {m.san}</p>
              <p className="mb-2 text-sm">
                Eval: {m.evaluation > 0 ? "+" : ""}
                {m.evaluation}
              </p>
              <p className="text-center text-xs text-gray-700 dark:text-gray-300">
                {m.line.slice(0, 7).join(" → ")}
                {m.line.length > 7 ? " ..." : ""}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {moves.length > 1 && (
        <>
          <div
            ref={prevRef}
            className="absolute top-1/2 left-2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/70 p-1 shadow dark:bg-gray-700/70"
          >
            <svg
              className="h-4 w-4 text-black dark:text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
          <div
            ref={nextRef}
            className="absolute top-1/2 right-2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/70 p-1 shadow dark:bg-gray-700/70"
          >
            <svg
              className="h-4 w-4 text-black dark:text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}
