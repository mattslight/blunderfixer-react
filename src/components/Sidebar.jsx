import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Drawer } from 'flowbite-react';

export default function Sidebar({ isSidebarOpen, closeSidebar }) {
  const [analyseOpen, setAnalyseOpen] = useState(false);

  return (
    <Drawer
      open={isSidebarOpen}
      onClose={closeSidebar}
      backdrop={true}
      placement="left"
      id="drawer-navigation"
      className="fixed top-0 left-0 z-40 h-screen w-64 border-r border-gray-200 bg-white pt-14 transition-transform xl:w-40 xl:translate-x-0 xl:p-0 xl:pt-14 dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="h-full overflow-y-auto bg-white px-3 py-5 dark:bg-gray-800">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/insights"
              className={({ isActive }) =>
                `group flex items-center rounded-lg p-2 text-base font-medium ${
                  isActive
                    ? 'bg-gray-200 text-blue-600 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                }`
              }
            >
              <svg
                aria-hidden="true"
                className="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
              </svg>
              <span className="ml-3">Insights</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/analyse"
              className={({ isActive }) =>
                `group flex items-center rounded-lg p-2 text-base font-medium ${
                  isActive
                    ? 'bg-gray-200 text-blue-600 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                }`
              }
            >
              <svg
                aria-hidden="true"
                className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-3">Analyse</span>
            </NavLink>

            {false && ( //eslint-disable-line
              <>
                <button
                  type="button"
                  onClick={() => setAnalyseOpen((o) => !o)}
                  className="group flex w-full items-center rounded-lg p-2 text-base font-medium text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  <svg
                    aria-hidden="true"
                    className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-3 flex-1 text-left whitespace-nowrap">
                    Analyse
                  </span>
                  <svg
                    aria-hidden="true"
                    className="h-6 w-6 transition-transform"
                    style={{
                      transform: analyseOpen
                        ? 'rotate(180deg)'
                        : 'rotate(0deg)',
                    }}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <ul className={`${analyseOpen ? '' : 'hidden'} space-y-2 py-2`}>
                  <li>
                    <NavLink
                      to="/analyse/game"
                      className={({ isActive }) =>
                        `group flex w-full items-center rounded-lg p-2 pl-11 text-base font-medium transition duration-75 ${
                          isActive
                            ? 'bg-gray-200 text-blue-600 dark:bg-gray-700 dark:text-white'
                            : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                        }`
                      }
                    >
                      Game
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/analyse/position"
                      className={({ isActive }) =>
                        `group flex w-full items-center rounded-lg p-2 pl-11 text-base font-medium transition duration-75 ${
                          isActive
                            ? 'bg-gray-200 text-blue-600 dark:bg-gray-700 dark:text-white'
                            : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                        }`
                      }
                    >
                      Position from FEN
                    </NavLink>
                  </li>
                </ul>
              </>
            )}
          </li>
          <li>
            <NavLink
              to="/train"
              className={({ isActive }) =>
                `group flex items-center rounded-lg p-2 text-base font-medium ${
                  isActive
                    ? 'bg-gray-200 text-blue-600 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                }`
              }
            >
              <svg
                aria-hidden="true"
                className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="ml-3">Training</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/games"
              className={({ isActive }) =>
                `group flex items-center rounded-lg p-2 text-base font-medium ${
                  isActive
                    ? 'bg-gray-200 text-blue-600 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                }`
              }
            >
              <svg
                aria-hidden="true"
                className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
              </svg>
              <span className="ml-3">Game History</span>
            </NavLink>
          </li>
        </ul>
        <ul className="mt-5 space-y-2 border-t border-gray-200 pt-5 dark:border-gray-700">
          <li>
            <NavLink
              to="/help"
              className={({ isActive }) =>
                `group flex items-center rounded-lg p-2 text-base font-medium ${
                  isActive
                    ? 'bg-gray-200 text-blue-600 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                }`
              }
            >
              <svg
                aria-hidden="true"
                className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
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
              <span className="ml-3">FAQ / Help</span>
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="absolute bottom-0 left-0 z-20 hidden w-full justify-center space-x-4 bg-white p-4 xl:flex dark:bg-gray-800">
        <NavLink
          to="/settings"
          data-tooltip-target="tooltip-settings"
          className={({ isActive }) =>
            `group inline-flex cursor-pointer justify-center rounded p-2 transition duration-75 ${
              isActive
                ? 'bg-gray-200 text-blue-600 dark:bg-gray-700 dark:text-white'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white'
            }`
          }
        >
          <svg
            aria-hidden="true"
            className="h-6 w-6"
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
    </Drawer>
  );
}
