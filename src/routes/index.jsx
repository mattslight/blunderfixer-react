import { Routes, Route } from "react-router-dom";
import Insights from "../pages/Insights";
import AnalysePosition from "../pages/AnalysePosition";
import AnalyseGame from "../pages/AnalyseGame";
import Profile from "../pages/Profile";
import GameHistory from "../pages/GameHistory";
import Training from "../pages/Training";
import Help from "../pages/Help";
import Settings from "../pages/Settings";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Insights />} />
      <Route path="/analyse/position" element={<AnalysePosition />} />
      <Route path="/analyse/game" element={<AnalyseGame />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/games" element={<GameHistory />} />
      <Route path="/train" element={<Training />} />
      <Route path="/help" element={<Help />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}