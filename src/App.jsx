// src/App.jsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import BackgroundLayer from '@/components/BackgroundLayer';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useProfile } from '@/hooks/useProfile';
import AppRoutes from '@/routes';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  const {
    profile: { username },
  } = useProfile();

  const loggedIn = !!username;

  return (
    <>
      <BackgroundLayer />
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      <main
        className={`z-10 min-h-screen w-full ${loggedIn && 'xs:pt-8 2xl:pl-32'}`}
      >
        <AppRoutes />
      </main>
    </>
  );
}
