import { Route, Routes } from 'react-router-dom';

import AnalyseGame from '../pages/AnalyseGame';
import AnalysePosition from '../pages/AnalysePosition/index';
import GameHistory from '../pages/GameHistory';
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
      <Route path="/analyse/position" element={<AnalysePosition />} />
      <Route path="/analyse/game" element={<AnalyseGame />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/games" element={<GameHistory />} />
      <Route path="/train" element={<Training />} />
      <Route path="/help" element={<Help />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
