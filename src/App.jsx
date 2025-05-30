import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes';

import { useProfile } from '@/hooks/useProfile';

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
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      <main className={`min-h-screen w-full ${loggedIn && 'pt-8 2xl:pl-32'}`}>
        <AppRoutes />
      </main>
    </>
  );
}
