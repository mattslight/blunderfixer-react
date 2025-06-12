import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Clock,
  Home,
  LifeBuoy,
  Settings,
  Target,
  Upload,
  X,
} from 'lucide-react';

import blunderLogoSvg from '@/assets/blunderfixer.svg';
import { useScrollDirection } from '@/hooks/useScrollDirection';

export default function MobileGlobalNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

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

  const scrollUp = useScrollDirection();

  return (
    <>
      <motion.button
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: scrollUp ? 1 : 0, y: scrollUp ? 0 : 40 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/70 px-2 py-1.5 pr-6 text-sm font-semibold text-stone-200 shadow-md backdrop-blur-sm"
        onClick={() => setOpen(true)}
      >
        <img
          src={blunderLogoSvg}
          className="shake-icon mr-1.5 inline-flex h-6 w-6"
        />{' '}
        Menu
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              className="fixed right-0 bottom-0 left-0 z-50 rounded-t-2xl bg-stone-900 px-6 pt-4 pb-8 text-white shadow-xl"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 250 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(e, info) => {
                if (info.offset.y > 100) setOpen(false); // threshold in px
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle */}
              <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-stone-200" />

              {/* Close button top-right */}
              <button
                className="absolute top-3 right-4 z-10 text-stone-200 hover:text-black"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>

              <ul className="mt-2 space-y-5">
                {menuItems.map((item, i) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <button
                      onClick={() => handleNav(item.path)}
                      className="flex items-center gap-4 text-lg text-stone-200 hover:text-stone-100"
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  </motion.li>
                ))}

                {/* Divider */}
                <hr className="my-4 border-t border-stone-700" />

                {/* Secondary actions */}
                <motion.li
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.35 }}
                >
                  <button
                    onClick={() => handleNav('/help')}
                    className="flex items-center gap-3 text-sm text-stone-400 hover:text-stone-200"
                  >
                    <LifeBuoy className="h-4 w-4" />
                    Help
                  </button>
                </motion.li>

                <motion.li
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.4 }}
                >
                  <button
                    onClick={() => handleNav('/settings')}
                    className="flex items-center gap-3 text-sm text-stone-400 hover:text-stone-200"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                </motion.li>
              </ul>
              <div className="pointer-events-none absolute right-0 -bottom-64 left-0 h-64 bg-stone-900" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
