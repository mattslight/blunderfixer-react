// src/components/Sidebar.jsx
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Drawer } from 'flowbite-react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

import EasterEggCredits, { useRapidTaps } from './EasterEggCredits';

import blunderLogoSvg from '@/assets/blunderfixer.svg';
import { useProfile } from '@/hooks/useProfile';

export default function Sidebar({ isSidebarOpen, closeSidebar }) {
  const location = useLocation();
  const [drillsOpen, setDrillsOpen] = useState(
    location.pathname.startsWith('/drills')
  );

  useEffect(() => {
    if (location.pathname.startsWith('/drills')) {
      setDrillsOpen(true);
    }
  }, [location.pathname]);

  const mainNav = [
    {
      to: '/insights',
      label: 'Insights',
      Icon: ({ className }) => (
        <svg
          aria-hidden="true"
          className={className}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
      ),
    },
    {
      to: '/games',
      label: 'Games',
      Icon: ({ className }) => (
        <svg
          aria-hidden="true"
          className={className}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7z" />
          <path d="M4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
      ),
    },
    {
      to: '/analyse',
      label: 'Analyse',
      Icon: ({ className }) => (
        <svg
          aria-hidden="true"
          className={className}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    // {
    //   to: '/profile',
    //   label: 'Profile',
    //   Icon: ({ className }) => (
    //     <svg
    //       aria-hidden="true"
    //       className={className}
    //       fill="currentColor"
    //       viewBox="0 0 20 20"
    //     >
    //       <path d="M10 2a4 4 0 100 8 4 4 0 000-8z" />
    //       <path d="M2 18a8 8 0 0116 0H2z" />
    //     </svg>
    //   ),
    // },
  ];

  const drillsNav = {
    to: '/drills',
    label: 'Drills',
    Icon: ({ className }) => (
      <svg
        aria-hidden="true"
        className={className}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        ></path>
      </svg>
    ),
  };

  const bottomNav = [
    {
      to: '/help',
      label: 'Help',
      Icon: ({ className }) => (
        <svg
          aria-hidden="true"
          className={className}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
    },
  ];

  const SettingsIcon = ({ className }) => (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
        clipRule="evenodd"
      />
    </svg>
  );

  const [showCredits, setShowCredits] = useState(false);
  // attach rapid-tap handler
  const onTapSidebar = useRapidTaps(3, 1000, () => setShowCredits(true));

  const {
    profile: { username },
  } = useProfile();

  if (!username) return null;

  return (
    <Drawer
      open={isSidebarOpen}
      onClose={closeSidebar}
      backdrop
      placement="left"
      id="drawer-navigation"
      className="fixed top-0 left-0 z-100 h-screen w-64 border-r border-gray-200 transition-transform 2xl:w-40 2xl:translate-x-0 2xl:p-0 2xl:pt-0 dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="h-full overflow-y-auto bg-gray-800 px-3 py-5">
        <div
          className="mb-4 font-medium whitespace-nowrap dark:text-gray-400"
          onClick={onTapSidebar}
        >
          <img
            src={blunderLogoSvg}
            className="shake-icon mr-1.5 mb-0.5 ml-2 inline-flex h-6 w-6"
          />
          BlunderFixer
        </div>
        <ul className="space-y-2 border-t border-gray-700 pt-8">
          {mainNav.map(({ to, label, Icon }) => (
            <li key={to}>
              <LinkItem to={to} label={label} Icon={Icon} />
            </li>
          ))}
          <li>
            <DropdownItem
              nav={drillsNav}
              open={drillsOpen}
              toggle={() => setDrillsOpen((o) => !o)}
            />
          </li>
        </ul>

        <ul className="mt-5 space-y-2 border-t border-gray-200 pt-5 dark:border-gray-700">
          {bottomNav.map(({ to, label, Icon }) => (
            <li key={to}>
              <LinkItem to={to} label={label} Icon={Icon} />
            </li>
          ))}
        </ul>
      </div>
      {/* pinned settings at bottom on 2xl+ */}
      <div className="absolute bottom-0 left-0 flex w-full justify-center bg-white p-4 dark:bg-gray-800">
        <NavLink
          to="/settings"
          data-tooltip-target="tooltip-settings"
          className="group inline-flex cursor-pointer justify-center rounded p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <SettingsIcon className="h-6 w-6" />
        </NavLink>

        <div
          id="tooltip-settings"
          role="tooltip"
          className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300"
        >
          Settings
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
      </div>
      {showCredits && (
        <EasterEggCredits onClose={() => setShowCredits(false)} />
      )}
    </Drawer>
  );
}

function LinkItem({ to, label, Icon }) {
  return (
    <NavLink to={to} end>
      {({ isActive }) => {
        const base =
          'group flex items-center rounded-lg p-2 text-base font-medium transition-colors';
        const active =
          'bg-gray-200 text-blue-600 bg-gray-700 dark:text-white bg-green-900';
        const idle =
          'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700';

        return (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${base} ${isActive ? active : idle}`}
          >
            <Icon className="h-6 w-6 flex-shrink-0 text-gray-400 transition-colors" />
            <span className="ml-3">{label}</span>
          </motion.div>
        );
      }}
    </NavLink>
  );
}

function DropdownItem({ nav, open, toggle }) {
  const { label, Icon } = nav;
  const base =
    'group flex w-full items-center rounded-lg p-2 text-base font-medium transition-colors';
  const active =
    'bg-gray-200 text-blue-600 bg-gray-700 dark:text-white bg-green-900';
  const idle =
    'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700';

  return (
    <div>
      <button
        onClick={toggle}
        className={`${base} ${open ? active : idle}`}
        type="button"
      >
        <Icon className="h-6 w-6 flex-shrink-0 text-gray-400 transition-colors" />
        <span className="ml-3 flex-1 text-left">{label}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <ul className="mt-1 space-y-1 pl-8">
          <li>
            <SubLinkItem to="/drills" label="All" />
          </li>
          <li>
            <SubLinkItem to="/drills/recent" label="Recent" />
          </li>
        </ul>
      )}
    </div>
  );
}

function SubLinkItem({ to, label }) {
  return (
    <NavLink to={to} end>
      {({ isActive }) => {
        const base =
          'block rounded-lg p-2 text-sm font-medium transition-colors';
        const active =
          'bg-gray-200 text-blue-600 bg-gray-700 dark:text-white bg-green-900';
        const idle =
          'text-gray-400 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700';

        return (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${base} ${isActive ? active : idle}`}
          >
            {label}
          </motion.div>
        );
      }}
    </NavLink>
  );
}
