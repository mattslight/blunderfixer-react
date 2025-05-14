/*
  src/components/EasterEggCredits.tsx

  Implements "Roll the Moves" cinematic credits Easter egg:
  - Triggered by 3 rapid taps on the BlunderFixer sidebar title
  - Fullscreen animated starfield with moving credits via Framer Motion
*/
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

// Hook: detect rapid taps
export function useRapidTaps(threshold = 3, timeout = 1000, onActivate) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (count === 0) return;
    const timer = setTimeout(() => setCount(0), timeout);
    return () => clearTimeout(timer);
  }, [count, timeout]);
  useEffect(() => {
    if (count >= threshold) {
      onActivate();
      setCount(0);
    }
  }, [count, threshold, onActivate]);
  return useCallback(() => setCount((c) => c + 1), []);
}

// Enhanced credits list
const credits = [
  {
    move: '1. e4',
    credit: '♔ Matt “King’s Gambit” Slight — Vision, UX, Code-Vibing',
  },
  { move: '1… c5', credit: '⚙️ Stockfish.js v16 — nmrugg' },
  { move: '2. Nf3', credit: '🖥️ Frontend — Flowbite React Contributors' },
  { move: '2… d6', credit: '🎨 Tailwind CSS — Adam Wathan & Tailwind Labs' },
  { move: '3. d4', credit: '♻️ SWR — Vercel Contributors' },
  { move: '3… cxd4', credit: '📦 TypeScript — Microsoft & Community' },
  { move: '4. Nxd4', credit: '🧳 react-router-dom — Remix Team' },
  { move: '4… Nf6', credit: '📖 react-markdown — Unified Collective' },
  { move: '5. Nc3', credit: '🎡 Swiper.js — nolimits4web' },
  { move: '5… a6', credit: '🌬️ Tailwind CSS — Adam Wathan & Tailwind Labs' },
  { move: '6. Be3', credit: '🧭 Vite — Evan You & Vite Team' },
  { move: '6… e5', credit: '🌐 Flowbite — Themesberg' },
  { move: '7. Nf5', credit: '⚛️ React & ReactDOM — Meta Open Source' },
  { move: '7… Bxf5', credit: '🎞️ Framer Motion — Framer Team' },
  { move: '8. exf5', credit: '📊 Recharts — Recharts Contributors' },
  { move: '8… d5', credit: '🕰️ date-fns — Contributors' },
  { move: '9. O-O-O', credit: '🧑‍🔬 QA / Playtesters — bharatmp & merlinjose' },
  { move: '9… Nxe4', credit: '📜 Remark GFM — Unified Collective' },
  { move: '10. Nxe4', credit: '📘 Lucide Icons — Lucide Contributors' },
  { move: '10… dxe4', credit: '♞ chess.js — Jeff Hlywa' },
  { move: '11. Qxd8', credit: '♟️ react-chessboard — Cotta & Contributors' },
  { move: '11… Rxd8', credit: '❤️ Henry & Sam — Love Together' },
  { move: '12. Rxd8#', credit: '♔ Checkmate — On You!' },
];

type Props = { onClose: () => void };
export default function EasterEggCredits({ onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Starfield canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const stars = Array.from({ length: 200 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.2,
      dx: (Math.random() - 0.5) * 0.7,
    }));
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      stars.forEach((s) => {
        s.x += s.dx;
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        ctx.globalAlpha = s.r / 1.8;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const SCROLL_DURATION = credits.length * 2; // your existing scroll time
  const FADE_DURATION = 3; // 1s fade-out

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center px-8 backdrop-blur-sm"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{
        times: [0, (SCROLL_DURATION - FADE_DURATION) / SCROLL_DURATION, 1],
        duration: SCROLL_DURATION,
        ease: 'linear',
      }}
      onAnimationComplete={onClose}
    >
      {/* Starfield */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* click overlay */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      <div className="relative h-screen w-full max-w-full overflow-hidden py-4 sm:max-w-xl">
        <motion.div
          style={{ position: 'absolute', bottom: 0, width: '100%' }}
          initial={{ y: '100%' }}
          animate={{ y: '-60%' }}
          transition={{ duration: SCROLL_DURATION, ease: 'linear' }}
          className="space-y-8 break-words text-white"
        >
          {credits.map((c, i) => (
            <p
              key={i}
              className="text-center text-xl font-semibold drop-shadow-xl md:text-2xl"
            >
              <span className="text-md mr-3 md:text-3xl">{c.move}</span>
              <span className="text-sm font-medium md:text-xl">{c.credit}</span>
            </p>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
