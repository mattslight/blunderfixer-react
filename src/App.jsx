import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AppRoutes from "./routes";

export default function App() {
  return (
  <>
    <Navbar />
    <Sidebar />
    <main class="p-4 md:ml-64 h-auto pt-20 w-full">
      <AppRoutes />
    </main>
  </>
  );
}
