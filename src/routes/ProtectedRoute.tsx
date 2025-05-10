import { useUsername } from '@/hooks/useUsername';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { username } = useUsername();
  return username ? children : <Navigate to="/" replace />;
}
