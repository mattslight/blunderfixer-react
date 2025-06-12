import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
} from 'framer-motion';
import {
  Clock,
  Home,
  LifeBuoy,
  LogOut,
  Settings,
  Target,
  Upload,
  X,
} from 'lucide-react';

import SignOutConfirmModal from './SignOutConfirmModal';

import blunderLogoSvg from '@/assets/blunderfixer.svg';
import useBlundersFixed from '@/hooks/useBlundersFixed';
import { useProfile } from '@/hooks/useProfile';
import { useScrollDirection } from '@/hooks/useScrollDirection';

export default function MobileGlobalNav() {
  const [open, setOpen] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);
  const navigate = useNavigate();
  const { profile, setUsername } = useProfile();
  const blundersFixed = useBlundersFixed();
  const scrollUp = useScrollDirection();

  const x = useMotionValue(0);

  useEffect(() => {
    const saved = localStorage.getItem('bf:params:menuXOffset');
    if (saved) x.set(parseFloat(saved));
  }, []);

  const menuItems = [
    { label: 'Home', icon: <Home className="h-5 w-5" />, path: '/' },
    { label: 'Drills', icon: <Target className="h-5 w-5" />, path: '/drills' },
    {
      label: 'Recent Games',
      icon: <Clock className="h-5 w-5" />,
      path: '/games',
    },
    {
      label: 'Analyse',
      icon: <Upload className="h-5 w-5" />,
      path: '/analyse',
    },
  ];

  const handleNav = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const handleSignOut = () => {
    setUsername('');
    setShowSignOut(false);
    setOpen(false);
  };

  const countryCode = profile.country?.split('/').pop()?.toUpperCase() || '';
  const flagEmoji = countryCode
    ? countryCode
        .split('')
        .map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397))
        .join('')
    : '';

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [constraints, setConstraints] = useState({ left: -150, right: 150 });

  useLayoutEffect(() => {
    if (!buttonRef.current) return;

    const buttonWidth = buttonRef.current.offsetWidth;
    const screenWidth = window.innerWidth;

    const maxOffset = (screenWidth - buttonWidth) / 2;
    setConstraints({ left: -maxOffset, right: maxOffset });
  }, []);

  return (
    <>
      <motion.button
        drag="x"
        dragConstraints={constraints}
        onDragEnd={(e, info) => {
          const rawOffset = info.point.x - window.innerWidth / 2;
          const snapThreshold = 40;
          const buttonWidth = 120;
          const maxOffset = (window.innerWidth - buttonWidth) / 2;
          const clampedOffset = Math.max(
            -maxOffset,
            Math.min(maxOffset, rawOffset)
          );
          const finalOffset =
            Math.abs(clampedOffset) < snapThreshold ? 0 : clampedOffset;

          animate(x, finalOffset, {
            type: 'spring',
            stiffness: 600,
            damping: 40,
          });

          localStorage.setItem('bf:params:menuXOffset', finalOffset.toString());
        }}
        style={{ x }}
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: scrollUp ? 1 : 0, y: scrollUp ? 0 : 40 }}
        transition={{ duration: 0.3 }}
        className="xs:hidden fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/70 px-2 py-1.5 pr-6 text-sm font-semibold text-stone-200 shadow-md backdrop-blur-sm"
        onClick={() => setOpen(true)}
      >
        <img
          src={blunderLogoSvg}
          className="shake-icon mr-1.5 inline-flex h-6 w-6"
        />
        Menu
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="fixed right-0 bottom-0 left-0 z-50 rounded-t-2xl bg-stone-900 px-6 pt-4 pb-8 text-white shadow-xl md:w-2xl md:justify-self-center"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 250 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(e, info) => {
                if (info.offset.y > 100) setOpen(false);
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-6 h-1 w-12 rounded-full border border-stone-700/40 bg-stone-500/60 shadow-sm" />

              <button
                className="absolute top-3 right-4 z-10 text-stone-200 hover:text-black"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mt-4 text-center">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name || profile.username}
                    className="mx-auto h-12 w-12 rounded-full border border-stone-600"
                  />
                ) : (
                  <div className="mx-auto h-12 w-12 rounded-full bg-stone-600" />
                )}
                <p className="mt-2 text-white">
                  {profile.name || profile.username}
                  {flagEmoji && <span className="ml-1">{flagEmoji}</span>}
                </p>
                <p className="text-xs text-stone-400">@{profile.username}</p>
              </div>

              <div className="mt-4">
                <p className="mt-2 text-center text-xs text-stone-400">
                  Blunders Fixed: {blundersFixed}
                </p>
              </div>

              <ul className="mt-6 space-y-5">
                {menuItems.map((item, i) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.1 + i * 0.025 }}
                  >
                    <button
                      onClick={() => handleNav(item.path)}
                      className="flex w-full items-center gap-4 text-lg text-stone-200 hover:text-stone-100"
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  </motion.li>
                ))}

                <hr className="my-4 border-t border-stone-700" />

                <motion.li
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.25 }}
                >
                  <button
                    onClick={() => handleNav('/help')}
                    className="flex w-full items-center gap-3 text-sm text-stone-400 hover:text-stone-200"
                  >
                    <LifeBuoy className="h-4 w-4" />
                    Help
                  </button>
                </motion.li>

                <motion.li
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.275 }}
                >
                  <button
                    onClick={() => handleNav('/settings')}
                    className="flex w-full items-center gap-3 text-sm text-stone-400 hover:text-stone-200"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                </motion.li>

                <motion.li
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.3 }}
                >
                  <button
                    onClick={() => setShowSignOut(true)}
                    className="flex items-center gap-3 text-sm text-red-500 hover:text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </motion.li>
              </ul>
              <div className="pointer-events-none absolute right-0 -bottom-64 left-0 h-64 bg-stone-900" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SignOutConfirmModal
        show={showSignOut}
        onCancel={() => setShowSignOut(false)}
        onConfirm={handleSignOut}
      />
    </>
  );
}
