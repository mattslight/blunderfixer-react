import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

import { useProfile } from '@/hooks/useProfile';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const {
    profile: { username },
  } = useProfile();
  return username ? children : <Navigate to="/" replace />;
}
