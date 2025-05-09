import { Route, Routes } from 'react-router-dom';

import AnalyseGame from '../pages/analyse';
import GameHistory from '../pages/games';
import Help from '../pages/Help';
import PreSignupHome from '../pages/home/PreSignupHome';
import Insights from '../pages/Insights';
import NotFound from '../pages/NotFound';
import Profile from '../pages/Profile';
import Settings from '@/pages/settings';
import Training from '@/pages/_placeholders/Training';
import ReportPage from '@/pages/report';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PreSignupHome />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/analyse" element={<AnalyseGame />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/games" element={<GameHistory />} />
      <Route path="/train" element={<Training />} />
      <Route path="/help" element={<Help />} />
      <Route path="/report/:analysisId" element={<ReportPage />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
