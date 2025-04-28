import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useRef, useMemo } from 'react';
import { Chess } from "chess.js";

export default function TopmovesCarousel({ result, onSlideChange }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const chess = useMemo(() => new Chess(result.fen), [result.fen]);

  // build an array that includes both UCI and SAN
  const moves = result.top_moves.map((m) => {
    const uci = m.move;                // e.g. "d2d4"
    const from = uci.slice(0,2);
    const to   = uci.slice(2,4);
    const promo = uci.length === 5 ? uci[4] : undefined;
    // apply the move to get a moveObject, then undo to keep board clean
    const moveObj = chess.move({ from, to, promotion: promo });
    const san = moveObj?.san || uci;
    chess.undo();

    return { ...m, san };
  });

  return (
    <div className="relative w-full mt-4">
      <Swiper
        modules={[Navigation]}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        spaceBetween={20}
        slidesPerView={1}
        onSlideChange={(swiper) => {
          if (onSlideChange) {
            onSlideChange(swiper.activeIndex);
          }
        }}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        className="rounded-lg"
      >
        {moves.map((m, index) => (
          <SwiperSlide key={index}>
            <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="mb-2">
                <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                  index === 0 ? "bg-green-500 text-white" : "bg-blue-500 text-white"
                }`}>
                  {index === 0 ? "Best Move" : `Alternative ${index}`}
                </span>
              </div>
              <p className="text-lg font-semibold mb-1">Move: {m.san}</p>
              <p className="text-sm mb-2">Eval: {m.evaluation > 0 ? "+" : ""}{m.evaluation}</p>
              <p className="text-xs text-gray-700 dark:text-gray-300 text-center">
                {m.line.slice(0, 7).join(" → ")}{m.line.length > 7 ? " ..." : ""}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Arrows */}
      <div
        ref={prevRef}
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 dark:bg-gray-700/70 p-1 rounded-full shadow cursor-pointer z-10"
      >
        <svg className="w-4 h-4 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </div>

      <div
        ref={nextRef}
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 dark:bg-gray-700/70 p-1 rounded-full shadow cursor-pointer z-10"
      >
        <svg className="w-4 h-4 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
