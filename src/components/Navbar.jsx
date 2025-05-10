import { useUsername } from '@/hooks/useUsername';
import UserMenu from './UserMenu';
const NOTIFICATIONS = false;

export default function Navbar({ toggleSidebar }) {
  const { username } = useUsername();
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 border-b border-gray-200 bg-white py-1.5 pl-2 md:pr-4 2xl:pl-8 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex items-center justify-start">
          {username && (
            <button
              className="mr-2 cursor-pointer rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 2xl:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700"
              onClick={toggleSidebar}
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
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                aria-hidden="true"
                className="hidden h-6 w-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Toggle sidebar</span>
            </button>
          )}
          <a href="/" className="mr-4 flex items-center justify-between">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              BlunderFixer ‼️
            </span>
          </a>
        </div>
        <div className="flex items-center lg:order-2">
          {/* Notifications */}
          {NOTIFICATIONS && (
            <button
              type="button"
              data-dropdown-toggle="notification-dropdown"
              className="mr-1 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:ring-4 focus:ring-gray-300 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-600"
            >
              <span className="sr-only">View notifications</span>
              {/* Bell icon */}
              <svg
                aria-hidden="true"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
              </svg>
            </button>
          )}
          {/* Dropdown menu */}
          <div
            className="z-50 my-4 hidden max-w-sm list-none divide-y divide-gray-100 overflow-hidden rounded rounded-xl bg-white text-base shadow-lg dark:divide-gray-600 dark:bg-gray-700"
            id="notification-dropdown"
          >
            <div className="block bg-gray-50 px-4 py-2 text-center text-base font-medium text-gray-700 dark:bg-gray-600 dark:text-gray-300">
              Notifications
            </div>
            <div>
              <a
                href="#"
                className="flex border-b px-4 py-3 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                <div className="flex-shrink-0">
                  <img
                    className="h-11 w-11 rounded-full"
                    src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png"
                    alt="Bonnie Green avatar"
                  />
                  <div className="bg-primary-700 absolute -mt-5 ml-6 flex h-5 w-5 items-center justify-center rounded-full border border-white dark:border-gray-700">
                    <svg
                      aria-hidden="true"
                      className="h-3 w-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
                      <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path>
                    </svg>
                  </div>
                </div>
                <div className="w-full pl-3">
                  <div className="mb-1.5 text-sm font-normal text-gray-500 dark:text-gray-400">
                    New message from
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Bonnie Green
                    </span>
                    : "Hey, what's up? All set for the presentation?"
                  </div>
                  <div className="text-primary-600 dark:text-primary-500 text-xs font-medium">
                    a few moments ago
                  </div>
                </div>
              </a>
              <a
                href="#"
                className="flex border-b px-4 py-3 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                <div className="flex-shrink-0">
                  <img
                    className="h-11 w-11 rounded-full"
                    src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png"
                    alt="Jese Leos avatar"
                  />
                  <div className="absolute -mt-5 ml-6 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-gray-900 dark:border-gray-700">
                    <svg
                      aria-hidden="true"
                      className="h-3 w-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
                    </svg>
                  </div>
                </div>
                <div className="w-full pl-3">
                  <div className="mb-1.5 text-sm font-normal text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Jese leos
                    </span>
                    and
                    <span className="font-medium text-gray-900 dark:text-white">
                      5 others
                    </span>
                    started following you.
                  </div>
                  <div className="text-primary-600 dark:text-primary-500 text-xs font-medium">
                    10 minutes ago
                  </div>
                </div>
              </a>
              <a
                href="#"
                className="flex border-b px-4 py-3 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                <div className="flex-shrink-0">
                  <img
                    className="h-11 w-11 rounded-full"
                    src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/joseph-mcfall.png"
                    alt="Joseph McFall avatar"
                  />
                  <div className="absolute -mt-5 ml-6 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-red-600 dark:border-gray-700">
                    <svg
                      aria-hidden="true"
                      className="h-3 w-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div className="w-full pl-3">
                  <div className="mb-1.5 text-sm font-normal text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Joseph Mcfall
                    </span>
                    and
                    <span className="font-medium text-gray-900 dark:text-white">
                      141 others
                    </span>
                    love your story. See it and view more stories.
                  </div>
                  <div className="text-primary-600 dark:text-primary-500 text-xs font-medium">
                    44 minutes ago
                  </div>
                </div>
              </a>
              <a
                href="#"
                className="flex border-b px-4 py-3 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                <div className="flex-shrink-0">
                  <img
                    className="h-11 w-11 rounded-full"
                    src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/roberta-casas.png"
                    alt="Roberta Casas image"
                  />
                  <div className="absolute -mt-5 ml-6 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-green-400 dark:border-gray-700">
                    <svg
                      aria-hidden="true"
                      className="h-3 w-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div className="w-full pl-3">
                  <div className="mb-1.5 text-sm font-normal text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Leslie Livingston
                    </span>
                    mentioned you in a comment:
                    <span className="text-primary-600 dark:text-primary-500 font-medium">
                      @bonnie.green
                    </span>
                    what do you say?
                  </div>
                  <div className="text-primary-600 dark:text-primary-500 text-xs font-medium">
                    1 hour ago
                  </div>
                </div>
              </a>
              <a
                href="#"
                className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <div className="flex-shrink-0">
                  <img
                    className="h-11 w-11 rounded-full"
                    src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/robert-brown.png"
                    alt="Robert image"
                  />
                  <div className="absolute -mt-5 ml-6 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-purple-500 dark:border-gray-700">
                    <svg
                      aria-hidden="true"
                      className="h-3 w-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                    </svg>
                  </div>
                </div>
                <div className="w-full pl-3">
                  <div className="mb-1.5 text-sm font-normal text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Robert Brown
                    </span>
                    posted a new video: Glassmorphism - learn how to implement
                    the new design trend.
                  </div>
                  <div className="text-primary-600 dark:text-primary-500 text-xs font-medium">
                    3 hours ago
                  </div>
                </div>
              </a>
            </div>
            <a
              href="#"
              className="text-md block bg-gray-50 py-2 text-center font-medium text-gray-900 hover:bg-gray-100 dark:bg-gray-600 dark:text-white dark:hover:underline"
            >
              <div className="inline-flex items-center">
                <svg
                  aria-hidden="true"
                  className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                View all
              </div>
            </a>
          </div>
          {username && <UserMenu />}
        </div>
      </div>
    </nav>
  );
}
