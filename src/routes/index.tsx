import { Route, Routes } from 'react-router-dom';

import PreSignupGuard from './PreSignupGuard';
import ProtectedRoute from './ProtectedRoute';

import Training from '@/pages/_placeholders/Training';
import AnalyseGame from '@/pages/analyse';
import Drills from '@/pages/drills';
import PlayDrill from '@/pages/drills/components/PlayDrill';
import RecentDrillsPage from '@/pages/drills/RecentDrillsPage';
import EndgameTrainer from '@/pages/endgames';
import GameHistory from '@/pages/games';
import Help from '@/pages/help';
import PreSignupHome from '@/pages/home/PreSignupHome';
import Insights from '@/pages/insights';
import NotFound from '@/pages/NotFound';
import PlayerProfile from '@/pages/profile';
import ReportPage from '@/pages/report';
import Settings from '@/pages/settings';

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PreSignupGuard>
            <PreSignupHome />
          </PreSignupGuard>
        }
      />
      <Route
        path="/insights"
        element={
          <ProtectedRoute>
            <Insights />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analyse"
        element={
          <ProtectedRoute>
            <AnalyseGame />
          </ProtectedRoute>
        }
      />
      <Route
        path="/games"
        element={
          <ProtectedRoute>
            <GameHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/train"
        element={
          <ProtectedRoute>
            <Training />
          </ProtectedRoute>
        }
      />
      <Route
        path="/drills"
        element={
          <ProtectedRoute>
            <Drills />
          </ProtectedRoute>
        }
      />
      <Route
        path="/drills/recent"
        element={
          <ProtectedRoute>
            <RecentDrillsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/drills/play/:id" element={<PlayDrill />} />
      <Route
        path="/endgames"
        element={
          <ProtectedRoute>
            <EndgameTrainer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <PlayerProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <Help />
          </ProtectedRoute>
        }
      />
      <Route
        path="/report/:analysisId"
        element={
          <ProtectedRoute>
            <ReportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
