import { useProfile } from '@/hooks/useProfile';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const {
    profile: { username },
  } = useProfile();
  return username ? children : <Navigate to="/" replace />;
}
