import { Route, Routes } from 'react-router-dom';

import Help from '@/pages/_placeholders/Help';
import Insights from '@/pages/_placeholders/Insights';
import Training from '@/pages/_placeholders/Training';
import AnalyseGame from '@/pages/analyse';
import GameHistory from '@/pages/games';
import PreSignupHome from '@/pages/home/PreSignupHome';
import NotFound from '@/pages/NotFound';
import ReportPage from '@/pages/report';
import Settings from '@/pages/settings';
import PreSignupGuard from './PreSignupGuard';
import ProtectedRoute from './ProtectedRoute';

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
