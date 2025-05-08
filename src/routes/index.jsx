import { Route, Routes } from 'react-router-dom';

import AnalyseGame from '../pages/analyse';
import DebugGameStore from '../pages/analyse/DebugGameStore';
import GameHistory from '../pages/games';
import Help from '../pages/Help';
import PreSignupHome from '../pages/home/PreSignupHome';
import Insights from '../pages/Insights';
import NotFound from '../pages/NotFound';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Training from '../pages/Training';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PreSignupHome />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/analyse/debug" element={<DebugGameStore />} />
      <Route path="/analyse" element={<AnalyseGame />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/games" element={<GameHistory />} />
      <Route path="/train" element={<Training />} />
      <Route path="/help" element={<Help />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
